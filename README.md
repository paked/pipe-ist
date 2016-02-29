# pipe-ist

A back to basics build tool for JavaScript, TypeScript and pretty much everything else. `pipe-ist` aims to be good at a single part of the building process: Pipelines.

## Usage

It is recommended to use `pipe-ist` in conjunction with [NPM Scripts](https://docs.npmjs.com/misc/scripts). If you need to run multiple commands at the same time see [`concurrently`](https://www.npmjs.com/package/concurrently) and for "watching" behaviour see [`onchange`](https://www.npmjs.com/package/onchange).

## Design Specification

All configuration is done in a `pipefile`. The `pipefile` used in this specification looks like the following:

```js
// pipefile.js
var pi = require('pipe-ist');

pi.task('default', [
    require('compile-typescript-pipe'),
    require('move-to-bin-pipe')
]);
```

`pipe-ist` differs from other build systems in what it does *not* do. It does not:

- Watch your files
- Automatically (and confusingly) package things
- [Abuse Tim Bernes-Lee's vision of the internet](https://defaultnamehere.tumblr.com/post/139351766005/graphing-when-your-facebook-friends-are-awake)

It focusses on one part of the "build" process:

- Pipelines

In the context of `pipe-ist` a pipeline is a series of "processes" which a file is passed through. We call each individual process a Pipe. Pipes have the opportunity to transform a file in whatever manner they like, and these changes will be reflected throughout the rest of the pipeline.

Take the example file structure:

```
- src/
  - main.ts
  - index.html
  - img/
    - your_face.png
```

[And the `pipefile.js` references above.](#design-specification)

In order to instantiate the task "default" we run the command `piper default` (it could just be `piper`, but we are being specific here!). This runs the task with the name "default", which is in this case our only task. It is here the "magic" begins.

Firstly, all of our files are passed through `compile-typescript-pipe` which yields the new file structure:

```
- src/
  - main.js
  - index.html
  - img/
    - your_face.png
```

*note: The file structure is copied into memory, so nothing is persisted until the pipeline has finished running. This means that your `main.ts` file WILL NOT be replaced with a compiled `main.js` on your actual file system!*

Each Pipe defines a function which will dynamically tell the pipeline runner whether or not it is fit to process a file. In this case, `main.ts` *was* eligible so was thus processed, however `your_face.png` and `index.html` were not.

Next the files are passed through `move-to-bin-pipe`. This results in:

```
- src/
- dist/
  - main.js
  - index.html
  - img/
    - your_face.png
```

Finally, because this is the last Pipe the virtual copies of the files are persisted into the file system. Which means that the end result for the *physical* file system would be:

```
- src/
  - main.ts
  - index.html
  - img/
    - your_face.png
- dist/
  - main.js
  - index.html
  - img/
    - your_face.png
```
