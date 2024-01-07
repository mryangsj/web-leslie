# Web-Leslie
## Web-based emulation of Leslie 147 Speaker

![Screenshot](/resources/image/markdown/mainWindow.png)

## Introduction
Welcome to Web-Leslie, a web-based emulation of the iconic Leslie 147 Speaker. This project was developed as part of the Advanced Coding Tools and Methodologies course. We chose to emulate the Leslie 147 Speaker due to its significant impact on the sound of electronic music and its fascinating mechanical and acoustic properties.

Web-Leslie is a JavaScript-powered application that runs entirely in your browser, making it a truly cross-platform solution. It leverages the latest WebAudio APIs to deliver a rich and interactive user experience. You can control our emulator using your PC's mouse and keyboard. 

Whether you're a music enthusiast wanting to explore the unique sound of the Leslie 147 Speaker, a developer interested in audio processing, or a student studying sound engineering, Web-Leslie offers an accessible and engaging way to interact with this classic piece of audio equipment.

## Leslie Speaker History

![Screenshot](/resources/image/markdown/leslie.jpg)

The Leslie speaker, named after its inventor Donald Leslie, is a combined amplifier and loudspeaker that projects the signal from an electric or electronic instrument and modifies the sound by rotating a baffle chamber ("drum") in front of the loudspeakers. 

Donald Leslie conceived this system in the late 1930s while seeking to replicate the sound of a pipe organ from his Hammond organ. The standard Hammond organ speaker produced a sound that, to Leslie, was not unlike an electric shaver; thus, he set out to invent a speaker system that would better mimic a pipe organ.

The Leslie speaker design is unique in that it uses a system of rotating horns and baffles to radiate the sound in various directions. The speed of rotation can be switched between slow ("chorale") and fast ("tremolo"), which creates a distinctive and dramatic wobbling effect that has become associated with the Hammond organ.

The Leslie speaker was initially rejected by the Hammond Organ Company, but it quickly became a standard piece of equipment for any serious organist due to its ability to closely mimic the sound of a pipe organ. It has since been used by musicians in various genres, from rock to jazz, and is still widely used today.

Among the various models of Leslie speakers, the Leslie 147 is particularly noteworthy. Introduced in the 1960s, the Leslie 147 is renowned for its rich, warm sound and its robust construction. It features a two-speed horn and bass rotor, and its amplifier is capable of delivering 40 watts of power. The Leslie 147 quickly became a favorite among professional musicians and is still highly sought after today for its iconic sound.

## Inside the Leslie Speaker

![Screenshot](/resources/image/markdown/leslie_inside.jpg)

At the heart of the Leslie speaker is an amplifier that drives a pair of loudspeakers. One speaker handles the treble (high) frequencies, and the other handles the bass (low) frequencies. 

The treble speaker is coupled to a horn, a kind of acoustic megaphone, which is designed to direct the sound in a specific direction. The bass speaker, on the other hand, is attached to a rotating drum. Both the horn and the drum are designed to rotate, which is what gives the Leslie speaker its unique sound.

As the horn and drum rotate, they cause the sound to be projected in different directions. This creates a kind of Doppler effect, where the pitch of the sound seems to change depending on the direction of the sound relative to the listener. This is what gives the Leslie speaker its characteristic 'swirling' sound.

The speed of the rotation can be controlled, allowing the musician to switch between a slow, rich chorus effect and a fast, vibrant tremolo effect. This versatility has made the Leslie speaker a favorite among musicians in a wide range of genres.

## User Interface Overview

The user interface of Web-Leslie is designed to be intuitive and easy to use, while still offering a high level of control over the sound.

Upon launching the application, you will be presented with a graphical representation of the Leslie 147 speaker. The speaker's rotating horn and drum are animated to give a visual indication of their current speed.

On the right side of the screen, you will find a control panel with a variety of knobs and switches. These controls allow you to adjust various aspects of the sound, including the speed of the horn and drum rotation, the balance between the treble and bass frequencies, and the overall volume.

The 'Chorale' and 'Tremolo' switches control the speed of the horn and drum rotation. 'Chorale' sets the rotation speed to slow, creating a rich, swirling sound. 'Tremolo' sets the rotation speed to fast, creating a vibrant, pulsating sound.

The 'Treble' and 'Bass' knobs allow you to adjust the balance between the high and low frequencies. Turning the knobs clockwise increases the volume of the respective frequencies.

The 'Volume' knob controls the overall volume of the sound. Turning it clockwise increases the volume.

We hope you enjoy exploring the unique sound of the Leslie 147 speaker with Web-Leslie!

## Left Panel

![Screenshot](/resources/image/markdown/left_panal.png)

1. **Power Switch:** turn on and off the lesie speaker
 

### Drive Block - Soft Overdrive

2. **Drive:** controls the amount of distortion
$$
f(x) = \frac{(1 + \alpha) x}{1 + \alpha|x|}
$$

![Screenshot](/resources/image/markdown/waveshaper.png)

$$
10^{\frac{gain}{20}} = A = f'(0) = 1 + \alpha \Rightarrow \alpha = 10^{\frac{gain}{20}} - 1
$$

![Screenshot](/resources/image/markdown/waveshaper_gain.png)


### EQ Block

3. **Low Cut:** adjust the low cut frequency
4. **High Cut:** adjust the high cut frequency
5. **High Shelf Frequency:** adjust the high shelf frequency
6. **High Shelf Gain:** adjust the high shelf gain
7. **Mid Frequency:** adjust the mid frequency
8. **Mid Gain:** adjust the mid gain
9. **Low Shelf Frequency:** adjust the low shelf frequency
10. **Low Shelf Gain:** adjust the low shelf gain

### Speed Control Block

11. **Oscillators Volume:** use this knobs to control the level of the oscillators
2. **On/Off Switch:** turn on or off the relativa oscillator
3. **White/Pink Noise:** with this switch you can choose between white and pink noise, while the first has a spectrum constant in magnitude, the magnitude of the second decreases above a certain frequency
4. **Noise Level:** adjusts the noise level

Some tips: noise is great when it comes to give "life" to a synthetic sounds, but its level must be low! 

### Mode Control Block

1. **Attack:** controls attack time
2. **Decay:** controls decay time
3. **Sustain:** controls sustain time
4. **Release:** controls release time


## Right Panel

![Screenshot](/resources/image/markdown/right_panal.png)

### Microphone Settings Block

![Screenshot](screenshots/effects.png)

#### Mixing Block


#### Output Block

*Delay is an audio effect or an effects unit which records an input signal to an audio storage medium, and then plays it back after a period of time. The delayed signal may either be played back multiple times, or played back into the recording again, to create the sound of a repeating, decaying echo.*

5. **On/Off Switch:** turn on and off the delay
6. **Time:** controls the time between the repetitions, set low for a "slapback" kind of sound, or high for a fuller sound
7. **Feedback:** controls the number of repetitions, use a short feedback and a high level to get the "slapback" sound mentioned before
8. **Level:** controls the volume of the first repetition, then the decay is controlled by the feedback level

### Output

![Screenshot](screenshots/output.png)

1. **Master Volume:** controls the overall output level of the synth
2. **A-440:** this switch let you play a simple sinusoid at 440 Hz (A), it's used to test the output level
3. **On/Off Switch:** master power switch, you have to turn this switch on in order to use the synth


## Technologies Used

### HTML, CSS & JS

Ous synth is a web application, so it's based on HTLM,CSS and JS code. With HTML we manage the structure of the interface, while the CSS files contain the information about the style of every section of the UI, starting from the background to the fonts and the colours. All the knobs are made with JKnobman, a simple program that let you design your custom knob and export it in PNG (then we rotate them from -135° to 135° with a CSS transformation). Javascrip play an important role, mainly with the WebAudio APIs described below, but also for all the functions related to clicks, drags and rotations made by the user with the mouse/trackpad.

#### Flexbox

#### Grid

### Web Audio API

Sounds and effects of our project are powered by the modern WebAudio APIs (you can learn more about them [here](https://developer.mozilla.org/it/docs/Web/API/Web_Audio_API)). In detail we used the libraries related to oscillators, gains and delays. Here's a brief description on how this APIs works:

>The Web Audio API involves handling audio operations inside an audio context, and has been designed to allow modular routing. Basic audio operations are performed with audio nodes, which are linked together to form an audio routing graph. Several sources — with different types of channel layout — are supported even within a single context. This modular design provides the flexibility to create complex audio functions with dynamic effects.

#### AudioWorklet


### Blender

![Screenshot](/resources/image/markdown/blender.jpg)

Blender, an open-source 3D computer graphics software, played a crucial role in the development of Web-Leslie. We used Blender to create a detailed 3D model of the Leslie 147 speaker. This model serves as the centerpiece of our user interface, providing users with a visually engaging way to interact with the emulator.

Blender's comprehensive suite of modeling tools allowed us to accurately replicate the unique design of the Leslie 147, from the rotating horn and drum to the control panel with its various knobs and switches. We also used Blender's animation tools to create the rotating effect of the horn and drum, which is synchronized with the actual sound produced by the emulator.

The use of Blender not only enhanced the visual appeal of Web-Leslie but also helped us better understand the mechanics of the Leslie 147 speaker. By building and animating the 3D model, we gained valuable insights into how the speaker's unique sound is produced.

### Photoshop

![Screenshot](/resources/image/markdown/photoshop.png)

### Sprite Sheet

### Surge

Our project is availabe to everyone thanks to Surge. Surge is a platform that let you publish online a web site/app for free in an extremely simple way.

>Surge: Static web publishing for Front-End Developers. Simple, single-command web publishing. Publish HTML, CSS, and JS for free, without leaving the command line.

Try out our web leslie! Link: --> [Web-Leslie](web-leslie.surge.sh/) <--  

## How to Use

### Web-Only

You can use our Mini Moog directly with the PC keyboard, the keys from "A" to "ù" are mapped to the notes from A 440 Hz to to the E of the octave above, use the "Tune" knob to shift the notes range below or above.

### With External MIDI KeyBoard

In order to use an external MIDI Keyboard you simply have to connect it with an USB cable, it's totally plug'n play!

### With ARDUINO

![Screenshot](screenshots/circuit.png)

You can use an Arduino Board connected to a simple circuit to control the synth parameters. Arduino sends MIDI messages to the synth, so you have to use Hairless MIDISerial to manage its MIDI messages and the ones coming from other sources like MIDI Keyboard at the same time. 

#### Arduino First Set Up 

1. Download and Install Arduino IDE from [here](https://www.arduino.cc/en/Main/Software)
2. Build the circuit on a breadboard and connect it to Arduino as shown in figure
3. Download the sketch ([sketch](https://github.com/Gioelson95/Web-Synth/blob/master/controllerArduino/controllerArduino.ino))
4. Run the sketch and upload it on Arduino ([here](https://www.arduino.cc/en/Guide/HomePage) you can read a detailed guide about this)

#### Arduino MIDI Set Up

![Screenshot](screenshots/hairless.png)
> How to set up Hairless MIDISerial

1. Connect Arduino to the PC with an USB cable
2. Run Hairless MIDISerial (download it [here](http://projectgus.github.io/hairless-midiserial/))
3. Select the Arduino port on "Serial Port"
4. Select other external MIDI devices (if connected) on "MIDI In"
5. Select internal MIDI bus on "MIDI Out"

#### Arduino as MIDI Controller
    
1. Connect Arduino, and after a while, if the setup was done correctly, a welcome message will appear
2. Click CONFIRM button to continue
3. Select the paramter you want to control with the first potenentiometer. Use UP and DOWN button to cycle through the list of parameters
4. Click CONFIRM button to continue
5. Repeat steps 3. and 4. for the other two potentiometers
6. When the selection is over, the LED turn on and the controller is ready to work
7. To change parameters, click CONFIRM button to exit from running mode, the LED will turn off
8. Click CONFIRM button to restart the configuration from step 3.	

### With Android App

![Screenshot](screenshots/androidSetup.jpg)	

In order to use your Android Smartphone as a controller for pitch bending and sustain simply connect it to your pc with a USB cable, and select "MIDI" as shown in picture above, then run our [app](https://github.com/Gioelson95/Web-Synth/blob/master/WebSynthMidiController/WebSynthController.apk) and select "Pitch" or "Sustain" (the selected option is highlighted in green, the other option, disabled, will be red).

## Video Demo
Here's a short demo of our project --> [Demo](https://youtu.be/8V7RUzdDKRA)


