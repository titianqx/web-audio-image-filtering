const canvas1 = document.querySelector('#canvas')
const context1 = canvas1.getContext('2d')

const canvasResult = document.querySelector('#canvas-result')
const rawResult = document.querySelector('#raw-result')
const filteredResult = document.querySelector('#filtered-result')
const contextResult = canvasResult.getContext('2d')
const rawContext = rawResult.getContext('2d')
const filteredContext = filteredResult.getContext('2d')

document.querySelector('#startButton').addEventListener('click', function () {
  var context = new AudioContext();
  context.resume().then(() => {
  const imageFilter = new Filter(context)

const baseImage = new Image()
baseImage.src = 'lena.jpg'

baseImage.onload = () => {
  const { width, height } = context1.canvas
  context1.drawImage(baseImage, 0, 0, width, height)

  const imageData = context1.getImageData(0, 0, context1.canvas.width, context1.canvas.height)
  // console.log('imageData', imageData);
  const splitted = splitRGB(imageData.data)
  // console.log('splitted', splitted);

  // const method = 'lowpass';
  const method = 'highpass';
  const frequency = 400;
  const line = 0;
  Promise.all([
    imageFilter.filterSignal(splitted.red, method, frequency),
    imageFilter.filterSignal(splitted.green, method, frequency),
    imageFilter.filterSignal(splitted.blue, method, frequency)
  ])
    .then((values) => {
      ['red', 'green', 'blue'].forEach((k,idx) => {
        const raw = splitted[k].slice((400 * line), 400 * (line + 1))
        const filtered = values[idx].slice((400 * line), 400 * (line + 1))
        drawWaveLine(raw, rawContext, k)
        drawWaveLine(filtered, filteredContext, k)
      })
      const arr = mountRGB({
        red: values[0],
        green: values[1],
        blue: values[2],
        alpha: splitted.alpha
      })
      plotFiltered(arr, contextResult)
    })
}
  });
});

