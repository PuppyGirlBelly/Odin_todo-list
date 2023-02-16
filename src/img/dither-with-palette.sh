# Original method, using an image with the desired palette to map the colours to
# convert <source> -ordered-dither o4x4 -remap palette.png <output>

# New method where an image is created on the fly to act as the palette, and passed into conversion command.
# Taken from this StackOverflow answer; https://stackoverflow.com/a/25265526
echo "Converting $1..."

input=$1
file="${input%.*}"
extension="${input##*.}"
output="${file}_dithered.${extension}"

convert -size 1x1 \
  xc:"#FFCDB1" \
  xc:"#FFB4A2" \
  xc:"#E5989B" \
  xc:"#B5838D" \
  xc:"#6D6875" \
  -append txt:- |\
convert $input -strip -coalesce -ordered-dither o4x4 -remap txt:- -layers optimize $output

echo "Written to $output!"
