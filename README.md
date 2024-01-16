# Web-Leslie
## Web-based emulation of Leslie 147 Speaker

![Screenshot](/resources/image/markdown/mainWindow.png)

## Introduction
Welcome to Web-Leslie, a web-based emulation of the iconic Leslie 147 Speaker. This project was developed as part of the *Advanced Coding Tools and Methodologies* course. We chose to emulate the Leslie 147 Speaker due to its significant impact on the sound of electronic music and its fascinating mechanical and acoustic properties.

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

Web-Leslie is designed to be intuitive and easy to use, while still offering a high level of control over the sound. Upon launching the application, you will be presented with a graphical representation of the Leslie 147 speaker. The speaker's rotating horn and drum are animated to give a visual indication of their current speed.

On the left and right side of the screen, you will find a control panel with a variety of knobs and switches. These controls allow you to adjust various aspects of the sound, including the speed of the horn and drum rotation, the balance between the treble and bass frequencies, and the overall volume.

## Left Panel

![Screenshot](/resources/image/markdown/left_panal.png)

The left panel primarily serves two functions: 
* Controlling the tonality of the sound (left side)
* Managing the motion state of the horn and drum (right side)

The left section of left panel comprises three blocks:
* **Power Block**: Turn on or off the lesie speaker.
* **Drive Block**: Distort the input sound.
* **EQ Block**: Adjust the tonality of the input sound.

The right section of left panel consists of the:
* **Horn Speed Control Block**: Control the rotational speed, acceleration, and deceleration of the horn.
* **Drum Speed Control Block**: Control the rotational speed, acceleration, and deceleration of the drum.
* **Mode Control Block**: Switch between `Slow`, `Fast`, and `Brake` modes.

Now, let's take a closer look at each of knobs and switches of the left panel.
1. **Power Switch:** turn on or off the lesie speaker.
2. **Drive:** adjust the amount of distortion applied to the input sound. Range from 0dB to 20dB, using soft clipping.
3. **Low Cut:** adjust the low cut frequency. Range from 20Hz to 800Hz.
4. **High Cut:** adjust the high cut frequency. Range from 3kHz to 20kHz.
5. **High Shelf Frequency:** adjust the high shelf frequency. Range from 2kHz to 18kHz.
6. **High Shelf Gain:** adjust the high shelf gain. Range from -15dB to 15dB.
7. **Mid Frequency:** adjust the mid frequency. Range from 400Hz to 8kHz.
8. **Mid Gain:** adjust the mid gain. Range from -15dB to 15dB.
9. **Low Shelf Frequency:** adjust the low shelf frequency. Range from 50Hz to 400Hz.
10. **Low Shelf Gain:** adjust the low shelf gain. Range from -15dB to 15dB.
11. **Horn speed:** fine-tune the speed of the horn rotation. Range from -30% to 30%. Usually, the weight of the horn is slighter than the drum, so the horn speed is slightly faster than the drum speed.
12. **Horn Acceleration:** fine-tune the acceleration of the horn rotation. Range from 0.25x to 4.0x. Same weight reason as above, the horn acceleration is slightly faster than the drum acceleration.
13. **Horn Deceleration:** fine-tune the deceleration of the horn rotation. Range from 0.25x to 4.0x. Same, the horn deceleration is slightly faster than the drum deceleration.
14. **Horn Speed Meter:** display the current speed of the horn rotation.
15. **Drum Speed:** fine-tune the speed of the drum rotation. Range from -30% to 30%.
16. **Drum Acceleration:** fine-tune the acceleration of the drum rotation. Range from 0.25x to 4.0x.
17. **Drum Deceleration:** fine-tune the deceleration of the drum rotation. Range from 0.25x to 4.0x.
18. **Drum Speed Meter:** display the current speed of the drum rotation.
19. **Slow:** 'Chorale' mode, set the rotation speed to slow. Speed approximately 1.0 Hz.
20. **Fast:** 'Tremolo' mode, set the rotation speed to fast. Speed approximately 6.0 Hz.
21. **Brake:** set the rotation speed to 0.0 Hz, stop the rotation of the horn and drum. When this mode is activated, the deceleration of the horn and drum is set to 4.0x.


## Right Panel

![Screenshot](/resources/image/markdown/right_panal.png)

The right panel primarily serves three functions:
* Set the width of the microphone. (upper section)
* Mix the sound of the horn and drum. (middle section)
* Control the output volume. (lower section)

The right panel consists of three blocks:
* **Microphone Control Block**: Set the width of the microphone and display the correlation of the microphone.
* **Mixing Block**: Mix the sound of four microphones.
* **Output Block**: Control the output volume and display the RMS+ of the output signal.

Now, let's take a closer look at each of knobs and switches of the right panel.
1. **Horn Mic Width:** adjust the width of the horn microphone. Range from 0° to 90°.
2. **Drum Mic Width:** adjust the width of the drum microphone. Range from 0° to 90°.
3. **Horn Mic Correlation Meter:** display the correlation of the horn microphone.
4. **Drum Mic Correlation:** display the correlation of the drum microphone.
5. **Left Horn Mic Pan:** adjust the pan of the left horn microphone. Range from -1.0 to 1.0.
6. **Right Horn Mic Pan:** adjust the pan of the right horn microphone. Range from -1.0 to 1.0.
7. **Left Drum Mic Pan:** adjust the pan of the left drum microphone. Range from -1.0 to 1.0.
8. **Right Drum Mic Pan:** adjust the pan of the right drum microphone. Range from -1.0 to 1.0.
9. **Left Horn Mic Level:** adjust the level of the left horn microphone. Range from -120dB to 6dB.
10. **Right Horn Mic Level:** adjust the level of the right horn microphone. Range from -120dB to 6dB.
11. **Left Drum Mic Level:** adjust the level of the left drum microphone. Range from -120dB to 6dB.
12. **Right Drum Mic Level:** adjust the level of the right drum microphone. Range from -120dB to 6dB.
13. **Link Horn Mics:** link the left and right horn microphones. When this switch is on, the left and right horn microphones will have the same level.
14. **Link Drum Mics:** link the left and right drum microphones. When this switch is on, the left and right drum microphones will have the same level.
15. **Master Volume:** adjust the output volume. Range from -120dB to 6dB.
16. **RMS+ Meter:** display the RMS+TP of the output signal.


## DSP
### Soft Clipping

$$
f(x) = \frac{(1 + \alpha) x}{1 + \alpha|x|}
$$

![Screenshot](/resources/image/markdown/waveshaper.png)

$$
10^{\frac{gain}{20}} = A = f'(0) = 1 + \alpha \Rightarrow \alpha = 10^{\frac{gain}{20}} - 1
$$

![Screenshot](/resources/image/markdown/waveshaper_gain.png)


## Technologies Used

### HTML, CSS & JS

Our project is a web-based application which is built using HTML, CSS, and JavaScript, forming a robust and interactive user interface.

The structure of the application is managed by HTML, providing a solid foundation for our user interface. The aesthetic aspects, including the background, fonts, and colors, are handled by CSS, ensuring a visually pleasing and intuitive user experience.

JavaScript plays a crucial role in our project. It interacts with the WebAudio APIs for sound manipulation.

One of the unique features of our application is the custom knob function. This function, which we will introduce in detail later, allows users to control various aspects of the sound output, providing a more immersive and personalized user experience.

### Flexbox & Grid

In the Leslie Speaker project, we utilize two powerful CSS layout models: Flexbox and Grid. These models provide a more efficient way to lay out, align, and distribute space among items in our user interface, even when their size is unknown or dynamic.

We use Flexbox to divide the whole page into three panels. This forms the basic layout of our project, providing a structured and organized interface for users to interact with.

For the layout of knobs and sliders, we introduce Grid. This two-dimensional layout system allows us to achieve a flexible layout, making it easier to position these elements in a way that is both aesthetically pleasing and user-friendly.

By combining Flexbox and Grid, we can create complex designs that are flexible and responsive, ensuring our Leslie Speaker application looks great on all devices and screen sizes.

### Knob API
In our project, we designed a custom Knob class which specilizes in audio application. This class implements a variety of common functions of knobs, including the rotation of the knob, the response to the cursor movement, and the display of the knob value. It also provides a variety of configuration options, allowing users to customize the appearance and behavior of the knob.

For example, we have a dedicated file `knobInit.js` for initializing the knobs. This file contains the configuration for each knob, including its scale, value range, label, and other settings.

We create a new knob by calling the `new Knob()` constructor, which takes several parameters including the container for the knob, the size ratio, the knob's ID, and a development mode flag.

After creating a knob, we set its properties using various methods:

- `setIndicatorSprite()`: Sets the path to the sprite image for the knob.
- `setScale()`: Sets the path to the scale image, the size ratio of the scale, and the fine-tune position of the scale.
- `setValueConfig()`: Configures the minimum, maximum, and default values for the knob.
- `setSkewForCenter()`: Adjusts the skew of the knob for centering purposes.
- `setCursorResponsive()`: Determines whether the knob responds to cursor movements.
- `setLabel()`: Sets the label for the knob and the CSS for the label.
- `setLabelResponsive()`: Sets whether the label is responsive, the decimal places for the label value, and the unit for the label.
- `setLabelEditable()`: Sets whether the label is editable by the user.

This initialization process ensures that each knob is fully configured and ready for user interaction, providing a more immersive and personalized user experience.

so as other function: `meterInit.js` `sliderInit.js` etc.

### Web Audio API

Sounds and effects of our project are powered by the modern WebAudio APIs (you can learn more about them [here](https://developer.mozilla.org/it/docs/Web/API/Web_Audio_API)). In detail we used the libraries related to oscillators, gains and delays. Here's a brief description on how this APIs works:

>The Web Audio API involves handling audio operations inside an audio context, and has been designed to allow modular routing. Basic audio operations are performed with audio nodes, which are linked together to form an audio routing graph. Several sources — with different types of channel layout — are supported even within a single context. This modular design provides the flexibility to create complex audio functions with dynamic effects.

### AudioWorklet
The core of DSP is implemented in AudioWorklet. AudioWorklet is a JavaScript code that runs in a separate thread from the main thread. It allows developers to implement custom DSP code that runs in a separate thread, which is more efficient than the traditional approach of using ScriptProcessorNode.

### Blender

![Screenshot](/resources/image/markdown/blender.jpg)

Blender, an open-source 3D computer graphics software, played a crucial role in the development of Web-Leslie. We used Blender to create a detailed 3D model of the Leslie 147 speaker. This model serves as the centerpiece of our user interface, providing users with a visually engaging way to interact with the emulator.

Blender's comprehensive suite of modeling tools allowed us to accurately replicate the unique design of the Leslie 147, from the rotating horn and drum to the control panel with its various knobs and switches. We also used Blender's animation tools to create the rotating effect of the horn and drum, which is synchronized with the actual sound produced by the emulator.

### Photoshop
![Screenshot](/resources/image/markdown/photoshop.png)
We use Photoshop to design the UI of our project. Photoshop is a powerful image editing software that allows us to create and edit images with ease. We use *Guids* extensively to help us align the elements of the UI since we want to use the *Grid* layout to make our UI responsive.


### Sprite Sheet

In this project, we choose to render a sprite sheet from Blender instead of directly importing the 3D model to the webpage to showcase the working animation of our Leslie speaker. A sprite sheet is a single image containing multiple smaller images or frames used in animation or graphics. Each frame represents 1 degree's rotation of the horn, drum, or mics. Using sprite sheets reduces draw calls, improves memory efficiency, ensures consistent texture filtering, and simplifies the loading and display of images.

The use of Blender not only enhanced the visual appeal of Web-Leslie but also helped us better understand the mechanics of the Leslie 147 speaker. By building and animating the 3D model, we gained valuable insights into how the speaker's unique sound is produced.


### Surge

Our project is availabe to everyone thanks to Surge. Surge is a platform that let you publish online a web site/app for free in an extremely simple way.

>Surge: Static web publishing for Front-End Developers. Simple, single-command web publishing. Publish HTML, CSS, and JS for free, without leaving the command line.

Try out our web leslie! Link: --> [Web-Leslie](web-leslie.surge.sh/) <--  


## Video Demo
Here's a short demo of our project --> [Demo](https://www.youtube.com/watch?v=-8PRpm4uVY8)