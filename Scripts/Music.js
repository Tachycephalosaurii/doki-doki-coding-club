function resetTransport() {
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  Tone.Transport.cancel();
}

function controlChange(CC, synth) {
  //https://anotherproducer.com/online-tools-for-musicians/midi-cc-list/
  switch (CC.number) {
    /*case 0:
    //Allows user to switch bank for patch selection. Program change used with Bank Select. MIDI can access 16,384 patches per MIDI channel.
    break;
    case 1:
    //Generally this CC controls a vibrato effect (pitch, loudness, brighness). What is modulated is based on the patch.
    var vib = new Vibrato();
    //synth.connect(vib);
    //console.log('connected!');
    break;
    case 6: 
    //Controls Value for NRPN or RPN parameters.
    break;
    */
    case 7:
      //Controls the volume of the channel.
      synth.volume.value = (CC.value * 100) - 100; //not accurate as it is in decibels
      break;
    /*
    case 10:
    //Controls the left and right balance, generally for mono patches. A value of 64 equals the center.
    break;
    case 11:
    //Expression is a percentage of volume (CC7).
    break;
    case 32:
    //??
    break;
    case 38: 
    //??
    break;
    */
    case 64:
      //On/off switch that controls sustain pedal. Nearly every synth will react to CC 64. (See also Sostenuto CC 66)
      if (CC.value >= 64) synth.CCSustain = true;
      break;
    /*case 91:
    //Usually controls reverb send amount
    break;
    case 93:
    //Usually controls chorus amount
    break;*/
    case 94:
      //Usually controls detune amount
      synth.detune = CC.value;
      break;
    /*
    case 100: 
    //(LSB) For controllers 6, 38, 96, and 97, it selects the RPN parameter.
    break;
    case 101: 
    //(MSB) For controllers 6, 38, 96, and 97, it selects the RPN parameter.
    break;*/
    default:
      console.warn(`ControlError: #${CC.number} cannot be handled`);
  }
}
function getInstrument(instrument) {
  switch (instrument) {
    case "reverse cymbal":
      return new Tone.MetalSynth().toDestination();
    case "standard kit":
      return new Tone.MembraneSynth().toDestination();
    case "contrabass":
      return new Tone.FMSynth().toDestination();
    case "electric bass (finger)":
      return new Tone.PluckSynth().toDestination();

    default: case 'acoustic grand piano':
      if (instrument !== 'acoustic grand piano') console.warn(`'acoustic grand piano' will be used instead of ${instrument}`)
      return new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0,
          decay: 0.5,
          release: 1
        },
      }).toDestination();
  }
}

function playTrack(track) {
  var synth = getInstrument(track.instrument.name);
  for (var cc in track.controlChanges) {
    var CC = track.controlChanges[cc][0];
    Tone.Transport.schedule(() => controlChange(CC, synth), Tone.Ticks(CC.ticks));
  }
  //schedule all of the events
  track.notes.forEach(function (note) {
    Tone.Transport.schedule(function (time) {
      var dura = note.duration + (synth.CCSustain ? 2 : 0);
      if (synth.options) synth.options.envelope.sustain = Math.max(0.01, Math.exp(-dura) * note.velocity * 0.5);
      synth.triggerAttackRelease(
        note.name,
        dura,
        time,
        note.velocity
      );
    }, note.time);
  });
}

var Music = {
  current: '',
  play: async function (song) {
    /* Reset and start the Transport */
    resetTransport()
    Tone.Transport.start();

    /* Update Current Song*/
    this.current = song.header.name;

    /* Schedule Notes and Signatures */
    song.header.tempos.forEach((e) => {
      Tone.Transport.schedule(() => Tone.Transport.bpm.value = e.bpm, Tone.Ticks(e.ticks));
    });
    song.header.timeSignatures.forEach((e) => {
      Tone.Transport.schedule(() => Tone.Transport.timeSignature = e.timeSignature, Tone.Ticks(e.ticks));
    });
    song.tracks.forEach((e) => playTrack(e));
  },
  stop: function () {
    resetTransport();
    this.current = '';
  }
};
