module.exports = iframer
module.exports.prototype = { /*on, off, jump, previous, next*/ } // API

function iframer (
  { opts, classname } = {},
  makeURL = _ => ''
) {
  var self = Object.create(module.exports.prototype)
  // self[_DOM] = _template(self)
  self[_STATE] = { opts, classname, makeURL }
  // self[_HANDLE] = {}
  // self[_EVENTS] = {}
  return self
}
// module.exports.prototype.handleEvent = handleEvent
/******************************************************************************
  EVENTS
******************************************************************************/
function render () {
  return (this[_DOM] || (this[_DOM] = _template(this))).view
}
// function log (stamp) { return _log(this, stamp) }
function write ({ type, key, value }) {
  const channel = _channels[type]
  if (channel) channel(this, key, value)
}
// function onfoobar (listen, last) {
//   this[_HANDLE].foobar = listen
//   if (last) _on.foobar(self, this[_EVENTS].foobar)
// }
// function handleEvent (event) { _on[event.target.dataset.call](this, event) }
/******************************************************************************
  HELPER
******************************************************************************/
const _template = self => {
  const { opts, classname, makeURL } = self[_STATE]
  const view = document.createElement('iframe')
  view.setAttribute('frameborder', 0)
  view.setAttribute('allowfullscreen', true)
  view.classname = classname
  view.setAttribute('src', makeURL(opts))
  return { view }
}
const _channels = { // INBOUND
  data (self, key, value) {
    if (key in self[_STATE]) {
      self[_STATE][key] = value
      // @TODO: maybe emit change event
      const dom = self[_DOM]
      // @TODO: if DOM is currently detached, then the next .render() call should update it...
      if (dom) var old = dom.view
      if (old) var container = old.parentElement
      if (container) {
        self[_DOM] = _template(self)
        container.replaceChild(self[_DOM].view, old)
      }
    }
  }
}
// const _log = (self, stamp = new Date()) => {
//   const { x, y, title } = self[_STATE]
//   const state = JSON.parse(JSON.stringify({ x, y, title }))
//   console.log(stamp, state)
//   return state
// }
const _DOM = Symbol('dom')
const _STATE = Symbol('state')
// const _HANDLE = Symbol('handle')
// const _EVENTS = Symbol('events')

/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/******************************************************************************
  USAGE (iframer)
******************************************************************************/
// console.log(iframer.prototype.arguments) /*{
//   data: {
//     class: classes.video,
//     src: "https://www.youtube.com/watch?v=9fvDp43rShA",
//   },
//   theme: {
//     '--foo': 'red',
//     '--bar': 'green',
//     '--baz': '50px',
//   },
//   children: [],
// }*/
// var player = iframer(/* iframer.prototype.arguments */)
// element = player.render()
//
// player = iframer({
//   data: {
//     class: classes.video,
//     src: "https://www.youtube.com/watch?v=9fvDp43rShA",
//   },
//   theme: {
//     '--foo': 'red',
//     '--bar': 'green',
//     '--baz': '50px',
//   },
//   // children: [],
// }, [])
//
// args = [{
//   class: classes.video,
//   src: "https://www.youtube.com/watch?v=9fvDp43rShA",
//   theme: {
//     '--foo': 'red',
//     '--bar': 'green',
//     '--baz': '50px',
//   }
//   css: {
//
//   }
// }, []]
//
// function iframer (data = {}, children = []) {
//   var self = Object.create(iframer.prototype)
//   Object.keys(data).forEach(key => {
//     if (key === 'class') { self.update(key, data[key]) }
//     if (key === 'src') { self.update(key, data[key]) }
//     if (key === 'theme') { self.update(key, data[key]) }
//   })
//   children.forEach(child => { })
//
//   if (Object.keys(theme).length) this.theme = theme
//   if (Object.keys(css).length) this.css = css
// }
// iframer.prototype.update = function (key, value) {
//
// }
// iframer.prototype.ondata = function ({ type, key, value }) {
//
// }
//
// player = iframer(args)
// element = player.render()



// const css = csjs`
//   .video       {
//     border     : 5px solid #d6dbe1;
//     width      : 50%;
//     align-self : center;
//     height     : 40vh;
//   }
//   .codesandbox {
//     margin     : 0;
//   }
//   .gitter      {
//     margin     : 0;
//   }
// `

// const classes = {
//   learn: css.video,
//   practice: css.codesandbox,
//   support: css.gitter,
// }
// const lesson = {
//   "title": "Move Bitcoin from Coinbase to Electrum",
//   "learn": "https://www.youtube.com/watch?v=9fvDp43rShA",
//   "practice": "",
// }
// const player = iframer({ class: classes.video, src: lesson.learn })


/******************************************************************************
  EVENTS
******************************************************************************/
// const _PREVIOUS = Symbol('previous')
// const _JUMP = Symbol('jump')
// const _NEXT = Symbol('next')
// function onPrevious (handler) { this[_PREVIOUS] = handler }
// function onJump (handler) { this[_JUMP] = handler }
// function onNext (handler) { this[_NEXT] = handler }
/******************************************************************************
  COMMANDS
******************************************************************************/
// function jump (lesson = 0) {
//   const self = this
//   const max = self[_MAX]
//   if (lesson < 0 || !(lesson < max)) return
//   self[_LESSON] = lesson
//   replaceChild(scope.self, scope.self = makeplayer(lesson))
//   self.onJump(scope.lesson)
// }
// function previous (event) {
//   const self = this
//   const lesson = self[_LESSON]
//   self.jump(lesson - 1)
//   self.onPrevious(lesson - 1)
// }
// function next (event) {
//   const self = this
//   const lesson = self[_LESSON]
//   self.jump(lesson + 1)
//   self.onNext(lesson + 1)
//
// }
/******************************************************************************
  HELPERS
******************************************************************************/
// const handleJump = self => event => self[_JUMP] && self[_JUMP]({
//   max: self[_MAX],
//   lesson: self[_LESSON],
// })
// const handleNext = self => event => self[_JUMP] && self[_JUMP]({
//   max: self[_MAX],
//   lesson: self[_LESSON],
// })
// const handlePrevious = self => event => self[_JUMP] && self[_JUMP]({
//   max: self[_MAX],
//   lesson: self[_LESSON],
// })
// const replace = (current, next) => {
//   current.parentElement.replaceChild(next, current)
// }
