# pipe-ist

`pipe-ist` is a build tool for node.js projects. It is modular but restrictive, and easy to go from zero to a fully working build process.

## Spec

Configuration is done in a `pipe.js` file. An example of this looks like the following:

```js
require('pipe-ist').
    task('default', [
        'assets-pipe',
        'typescript-pipe'
    ]);
```

`pipe-ist` makes various assumptions about your project.

- Your output folder is `dist`

The values you provide can be either:

- `strings`: The name of the package on NPM. Will be `require(str)`'d
- `functions`: A function to exectute, must match the `function(files, config) -> Output` pattern

The basic principle is that everything is "piped" from one handler to another, each time the handler may transform a file which will be reflected in the next pipe. For example imagine the file structure:

- src/
  - `main.ts`
  - `style.sass`
  - `index.jade`
  - img/
    - `your_face.png`
    - `my_face.jpg`
- dist/

And the `pipe.js` file:

```js
require('pipe-ist').
  task('default', [
    'typescript-pipe',
    'sass-pipe',
    'jade-pipe',
    'jpg-pipe',
    'assets-move-pipe',
    'serve'
  ]);
```

Firstly, we pipe this through the "typescript" pipe. Which then becomes reflected as:

- src/
  - `style.sass`
  - `index.jade`
  - img/
    - `your_face.png`
    - `my_face.jpg`
- dist/
  - `main.js`

*note: The working tree exists in memory, so the removal of files from the tree does not delete them from your system*

Then we pipe these resources through the "jade" and "sass" pipes respectively:

- src/
  - img/
    - `your_face.png`
    - `my_face.jpg`
- dist/
  - `main.js`
  - `style.css`
  - `index.html`

Now we have another pipe which converts all `jpg` files into `png`s.

- src/
  - img/
    - `your_face.jpg`
    - `my_face.jpg`
- dist/
  - `main.js`
  - `style.css`
  - `index.html`

*Notice how that not all pipes have to move the file into the distribution folder*

And then another to move these `jpg` files into the distribution place.

- src/
- dist/
  - `main.js`
  - `style.css`
  - `index.html`
  - img/
    - `your_face.jpg`
    - `my_face.jpg`

Which produces the final result. At this point `pipe-ist` will watch for any changes and if there are, re-execute the piping process. Due to the way files are treated programatically any files that have not been changed will not need to be reprocessed.
