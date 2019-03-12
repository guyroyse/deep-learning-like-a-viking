# Deep Learning Like a Viking Workshop
## Prerequisites

If you're planning to do Deep Learning Like a Viking, you should be prepared
like a Viking. Follow these steps before you come to the workshop and you
shouldn't even need to access the Internet (like a Viking or not).

## Install Anaconda

Download and install Anaconda for Python 3.7 from
https://www.anaconda.com/distribution/#download-section.
Follow the instructions there and in the installer.

## Setup Anaconda

We'll need some packages installed to make this work so let's use Anaconda for
it's intended purpose and setup an isolated environment to install them in.

    $ conda create --name viking python=3.7

And then we can activate that environment.

    $ conda activate viking

And then install our dependencies.

    $ conda install keras
    $ conda install scikit-learn

So far so good.

## Clone the Repository

Next, clone the repository for the workshop. It has my slides, the abstract, a
complete runic classifier, and the workshop material in it.

    $ git clone https://github.com/guyroyse/deep-learning-like-a-viking.git

or

    $ git clone git@github.com:guyroyse/deep-learning-like-a-viking.git

And, you're all set for the workshop. See ya at the event!
