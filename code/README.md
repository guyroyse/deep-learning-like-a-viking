# Deep Learning like a Viking

If you'd like to test out this code here's all the things you need to do to get
it up and running. These instructions are for Linux and Mac users. I don't have
a Windows machine but if you do, these instructions will probably still work.
And if they don't, feel free to send me a pull request with what is need to
make them work.

On to the instructions!

## Getting Started like a Viking

If you're planning to do Deep Learning Like a Viking, you should be prepared
like a Viking. First off, you need a Python environment. Follow these steps and
you shouldn't even need to access the Internet (like a Viking or not).

### Install Anaconda

Download and install Anaconda for Python 3.9 from
https://www.anaconda.com/distribution/#download-section.
Follow the instructions there and in the installer.

### Setup Anaconda

We'll need some packages installed to make this work so let's use Anaconda for
it's intended purpose and setup an isolated environment to install them in.

    $ conda create --name viking python=3.9

And then we can activate that environment.

    $ conda activate viking

And then install our dependencies.

    $ conda install tensorflow
    $ conda install scikit-learn
    $ conda install flask

So far so good.

NOTE: All these commands are run from the code folder (the same place as this
README).

## Entering Runes like a Viking

Before you can detect runes, you need to build a model. And before you can
build a model, you need data. That means image data for the runes.

Now, I've already created a few hundred runes to build a model with. They are a
series of JSON files, one for each rune, in the `data` folder. You are free to
use them, of course, but you might want to enter some runes of your own.

Why? Well, the runes I entered are written in my hand and so the model they
build will be great at recognizing my hand writing but perhaps not yours. Plus,
I'd love to have some extra runes for my repository. So, if you wanted to
create a few and send me a pull request, that would be super-awesome!

To enter your own runes, simple start the Flask application.

    $ python app.py

This will start a web server listening or port 5000. Navigate to
http://127.0.0.1:5000 and on the left you will see a rune. Draw that rune. If
you mess up, hit the **Clear** button. If you're happy with it, hit the
**Save** button. When you save it, it will write out a new JSON file to the
`data` folder, clear the drawing canvas, and present you with a new rune to
draw. Do this as long as you care to.

## Building a Model like a Viking

One of the things I did with the application which is inefficient but also
pretty handy is that I load the model every single time you do a detection.
This is a great candidate for caching in a real application. However, it does
result in the ability to hot swap the model while the server is running. Useful
if you're playing around, which we are.

To build the model, simply run `build_model.py`:

     $ python build_model.py

It'll take a minute or two to run and will place the model files in the `model`
folder. At the very end, the model will be evaluated and you will be told how
it performed with a line like this:

    Model Score: [0.4759753206629812, 0.9012345693729542]

The number of the left is the loss and the number on the right is the accuracy.

## Detecting Runes like a Viking

Once you've got a model, you can start using it. The Flask application that let
you enter runes is the same application you can use to detect them. Start it up
again if isn't already running:

    $ python app.py

Now, pick a rune from the 16 at the bottom and draw it on the drawing canvas.
If you mess it up, hit the **Clear** button and redraw it. Once you are happy
with the run, smash the **Detect** button. After a couple of seconds, you will
see what rune the model thinks you have entered.

Repeat until exhaustion and your done.

## Thanks like a Viking

So, I hope this this was helpful. If you find any bugs or issues with the
codebase or this documentation, please feel free to send me a pull request.
And, thanks for checking it out.
