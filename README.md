# Easy Mesh Gradient

![Frame 2 (2)](https://user-images.githubusercontent.com/3497863/210480494-fe5c3edf-5684-4881-8295-ea702e66e33e.png)

## Installation

To install, use npm:
```
npm install easy-mesh-gradient
```
or yarn:
```
yarn add easy-mesh-gradient
```

## Usage

```tsx
import easyMeshGradient from "easy-mesh-gradient";

const mesh = easyMeshGradient();

function MyApp() {
  return (
    <div style={{backgroundImage: mesh})>
      Hello world!
    </div>
  );
}

export default MyApp;
```

### Options
The easyMeshGradient function accepts an optional options object with the following properties:

#### points
An array of points that define the mesh gradient. Each point should have the following properties:

- `x`: The x coordinate of the point as a decimal between 0 and 1.
- `y`: The y coordinate of the point as a decimal between 0 and 1.
- `h`: The hue of the point as a number between 0 and 360.
- `s`: The saturation of the point as a decimal between 0 and 1.
- `l`: The lightness of the point as a decimal between 0 and 1.
- `scale`: A number representing the size of the gradient fade around the point.

If the `points` option is not specified, the library will generate points using the `pointsGenerator` function (see below).

#### `easing`
A function that defines the easing of the gradient transitions between points. This function should accept a number between 0 and 1 and return a number between 0 and 1. The default easing function is easeInOutCubic.

#### `easingStops`
The number of intermediate colors to use in the gradient transitions between points. The default value is 10.

#### `seed`
A string that is used to seed the random number generator when generating points. This allows the generated points to be reproducible.

#### `pointCount`
The number of points to generate when using the pointsGenerator function. The default value is 5.

#### 'scaleRange'
A 2-element array that defines the minimum and maximum allowed values for the scale property of generated points. The default value is [0.5, 2].

#### `hueRange`
A 2-element array that defines the minimum and maximum allowed values for the h property of generated points. The default value is [0, 360].

#### `saturationRange`
A 2-element array that defines the minimum and maximum allowed values for the s property of generated points. The default value is [0.5, 1].

#### `lightnessRange`
A 2-element array that defines the minimum and maximum allowed values for the l property of generated points. The default value is [0.5, 1].

#### `pointsGenerator`
A function that generates an array of points when the points option is not specified. This function should accept an options object with the same properties as the main easyMeshGradient function, and return an array of points with the same structure as described above for the points option. The default pointsGenerator function is provided by the library.

### Example

```tsx
import easyMeshGradient from "easy-mesh-gradient";

const gradientString = easyMeshGradient({
  points: [
    { x: 0.1, y: 0.1, h: 120, s: 0.8, l: 0.6, scale: 1 },
    { x: 0.5, y: 0.5, h: 60, s: 0.7, l: 0.5, scale: 1.5 },
    { x: 0.9, y: 0.9, h: 300, s: 0.6, l: 0.4, scale: 1 },
  ],
  easingStops: 20,
});

document.body.style.backgroundImage = `${gradientString}`;
```

This will generate a mesh gradient with 3 points, using 20 intermediate colors in the gradient transitions and the default easing function. The resulting gradient will be applied as the `background-image` of the `document.body` element.

### License
MIT

(documentation co-authored by chatGPT 😄)
