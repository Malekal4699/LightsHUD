#!/bin/sh

rm torchlight.zip
cd .. && zip -x\*.git\* -r torchlight/torchlight.zip torchlight -x \*.git\* \*zipit.sh \*.archive\*
