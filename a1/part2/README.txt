Austin Kobayashi

I changed the movement for the bunny a little. The "w" key didn't cause the bunny
to move forwards relative to its rotation, so I just reordered the keys so that:
- "w" moves the bunny forward relative to the model
- "s" moves the bunny backward relative to the model
- "d" moves the bunny right relative to the model
- "a" moves the bunny left relative to the model

For the creative part, I added a noise function to the egg, so that the model gets
distorted when the bunny moves. The noise function takes in the distance from the 
vertex to the bunny, calculates a random noise, then the vertex position is transformed
along the normal by the noise amount.
I also added in a feature where pressing "F" will shoot up an egg firework, then the 
egg will explode along the face normals. This one was quite difficult to get working
since there doesn't seem to be a geometry shader in WebGL.