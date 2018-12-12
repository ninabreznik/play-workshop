var csjs = require('csjs-inject')
var bel = require('bel')
var belmark = require('belmark')

module.exports = workshop

var minimap

async function workshop ({ workshop, theme = {} } = {}) {
  // var data = workshop ? require(workshop) : await fetch('/workshop.json')
  var data = await fetch(new URL('./workshop.json', location.href).href).then(response => response.json())
  var font_url = theme['--font']
  minimap = theme['--map']
  var lessons = data.lessons
  var chat = data.chat
  if (!chat) throw new Error('no chat found')
  if (!lessons || lessons.length === 0) throw new Error('no lessons found')
  var css = styles(font_url || 'arial')

  var video = iframe(lessons[0].lesson, css.video)
  var editor = iframe(lessons[0].tool, css.editor)
  var gitter = iframe(chat, css.gitter)
  var title = bel`<div title=${lessons[0].title} class=${css.title}>${lessons[0].title}</div>`
  var logo_url = data.icon

  var logo = logo_url ? bel`
    <img class="${css.logo} ${css.img}" onclick=${home} title="decentralized e-learning made by play.ethereum.org" src="${logo_url}">
  ` : ''

  var lesson = 0
  var series = bel`<span class=${css.series}>${'Learn with Play: ' +  data.title}</span>`

  var chatBox = bel`<div class=${css.chatBox}>
    <div style="width: 100%; height: 100%; flex-grow: 1; display: flex; justify-content: center; align-items: center">
      ... loading support chat ..."
    </div>
    ${gitter}
  </div>`

  async function getMarkdown (lessonInfo) {
    if (typeof lessonInfo !== 'string') var info = belmark(lessonInfo.join('\n'))
    else {
      var infoMarkdown = await fetch(lessonInfo).then(response => response.text())
      var info = belmark(infoMarkdown)
    }
    return info
  }

  if (lessons[0].info) {
    var info = await getMarkdown(lessons[0].info)
  } else {
    var info = belmark`no description`
  }
  info.className = ` ${css.welcome}`
  var infoBox = bel`<div class=${css.infoBox}>${info || xxx}</div></div>`
  var view = 'info'

  var stats = bel`<span class=${css.stats}>${lesson + 1}/${lessons.length}</span>`
  var infoButton = bel`<div class="${css.infoViewButton}" title='infoButton' onclick=${changeView}>Info</div>`
  var chatButton = bel`<div class="${css.chatViewButton}" title='chatButton' onclick=${changeView}>Chat</div>`

  var needsOpen = false
  var unlocksOpen = false
  function needs () {
    if (needsOpen) {
      var dropdown = document.querySelector('#needs')
      dropdown.parentElement.removeChild(dropdown)
      needsOpen = false
    } else {
      var el = bel`
      <ul id="needs" style="position: absolute; top: 75px; left: 0; width:100px; height: 100px; background-color: pink;">
      ${data.needs.map(url => bel`<li><a href="${url}" target="_blank">${url}</a></li>`)}
      </ul>
      `
      document.body.appendChild(el)
      needsOpen = true
    }
  }
  function unlocks () {
    if (unlocksOpen) {
      var dropdown = document.querySelector('#unlocks')
      dropdown.parentElement.removeChild(dropdown)
      unlocksOpen = false
    } else {
      var el = bel`
      <div id="unlocks" class=${css.minimapExtended}></div>
      `
      document.body.appendChild(el)
      unlocksOpen = true
    }
  }
  var app = bel`
    <div class="${css.content}">
      <div class=${css.menu}>
        <div class=${css.minimap} onclick=${unlocks}><input class=${css.minimapButton} title="Skill tree" type="image" src="${minimap}"></div>
        <span class=${css.head}>
          <span class=${css.banner}>${logo} ${series}</span>
          ${stats} ${title}
        </span>
      </div>
      <div class=${css.container}>
        <div class=${css.narrow}>
          <div class=${css.top}>
            <div class=${css.switchButtons}>
              <div class="${css.previous}" title="Previous lesson" onclick=${previous}> ${'<'} </div>
              <div class=${css.lesson}>${title} ${stats}</div>
              <div class="${css.next}" title="Next lesson" onclick=${next}> ${'>'} </div>
            </div>
            ${video}
          </div>
          <div class=${css.bottom}>
            <div class=${css.switchButtons}>
              ${infoButton}
              ${chatButton}
            </div>
            ${infoBox}
          </div>
        </div>
        <div class=${css.wide}>
          ${editor}
        </div>
      </div>
    </div>
  `
  document.body.appendChild(app)

  window.addEventListener('keyup', function (event) {
    var left = 37
    var right = 39
    if (event.which === left) previous()
    else if (event.which === right) next()
  })
  async function previous (event) {
    if (lesson <= 0) return
    lesson--
    var old = video
    video = iframe(lessons[lesson].lesson, css.video)
    old.parentElement.replaceChild(video, old)
    stats.innerText = `${lesson + 1}/${lessons.length}`
    title.innerText = lessons[lesson].title || ''
    title.title = title.innerText
    if (lessons[lesson].info) {
      info.innerText = ''
      info.appendChild(belmark(lessons[lesson].info))
    } else {
      info.innerText = ''
      info.appendChild(belmark`no description`)
    }
  }

  async function next (event) {
    if (lesson >= lessons.length - 1) return
    lesson++
    var old = video
    video = iframe(lessons[lesson].lesson, css.video)
    old.parentElement.replaceChild(video, old)
    stats.innerText = `${lesson + 1}/${lessons.length}`
    title.innerText = lessons[lesson].title || ''
    title.title = title.innerText
    if (lessons[lesson].info) {
      info.innerText = ''
      info.appendChild(belmark(lessons[lesson].info))
    } else {
      info.innerText = ''
      info.appendChild(belmark`no description`)
    }
  }

  function iframe (src, classname) {
    return bel`
      <iframe
        class="${classname} ${css.iframe}"
        src="${src}"
        frameborder="0"
        allowfullscreen
      ></iframe>
    `
  }

  function changeView (e) {
    console.log(e.target.title)
    // console.log('view =', view)
    var parent = document.querySelector(`.${css.bottom}`)
    // console.log(parent)
    if (e.target.title === 'infoButton') {
      infoButton.style = `background-color: white; color: purple;`
      chatButton.style = ''
      if (view != 'info') {
        parent.removeChild(chatBox)
        parent.appendChild(infoBox)
        return view = 'info'
      }
    }
    if (e.target.title === 'chatButton') {
      chatButton.style = `background-color: white; color: purple;`
      infoButton.style  = ''
      if (view != 'chat') {
        parent.removeChild(infoBox)
        parent.appendChild(chatBox)
        return view = 'chat'
      }
    }
  }

  function showChat () {
    var parent = document.querySelector(`.${css.narrow}`)
    parent.removeChild(infoBox)
    parent.appendChild(chatBox)
  }

  function home () {
    window.open('http://github.com/ethereum/play', '_blank');
  }
}

function styles (font_url) {
  var FONT = font_url.split('/').join('-').split('.').join('_')
  var font = bel`
    <style>
    @font-face {
      font-family: ${FONT};
      src: url('${font_url}');
    }
    </style>`
  document.head.appendChild(font)

  var colors = {
    white: "#ffffff", // borders, font on input background
    dark: "#2c323c", //background dark
    darkSmoke: '#21252b',  // separators
    whiteSmoke: "#f5f5f5", // background light
    lavenderGrey: "#e3e8ee", // inputs background
    slateGrey: "#8a929b", // text
    violetRed: "#b25068",  // used as red in types (bool etc.)
    aquaMarine: "#90FCF9",  // used as green in types (bool etc.)
    turquoise: "#14b9d5",
    yellow: "#F2CD5D",
    androidGreen: "#9BC53D"
  }

  var css = csjs`
    *, *:before, *:after { box-sizing: inherit; }
    .img { box-sizing: content-box; }
    .iframe { border: 0; height: 100%; }
    .content {
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      height: 100%;
      overflow: hidden;
    }
    .menu {
      display: flex;
      align-items: center;
      height: 5%;
      background-color: ${colors.dark};
    }
    .container {
      display: flex;
      background-color: ${colors.dark};
      border-top: none;
      flex-grow: 1;
    }
    .previous, .next {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 40px;
      height: 40px;
      line-height: 100%;
      font-size: calc(20px + 0.3vw);
    }
    .previous:hover, .next:hover {
      color: ${colors.lavenderGrey};
    }
    .lesson {
      display: flex;
      align-items: center;
      justify-content: center;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 2%;
      border-left: 2px solid ${colors.dark};
      border-right: 2px solid ${colors.dark};
    }
    .head {
      margin: 0 5%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: black;
      font-family: ${FONT};
    }
    .button:hover {
      color: ${colors.lavenderGrey};
    }
    .logo {
      width: 35px;
      height: 35px;
    }
    .logo:hover {
      opacity: 0.9;
      cursor: pointer;
    }
    .banner {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .stats {
    }
    .series {
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 2%;
      color: ${colors.androidGreen};
      font-size: calc(10px + 0.5vw);
      font-weight: 900;
      white-space: nowrap;
      padding-top: 3px;
    }
    .minimapButton {
      border-radius: 50%;
      border: 1.5px solid ${colors.androidGreen};
      cursor: pointer;
      width: calc(10px + 1.5vmin);
      height: calc(10px + 1.5vmin);
    }
    .minimap {
      background-color: ${colors.dark};
      width: 30px;
      height: 30px;
      margin-left: 2%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .minimapExtended {
      background-image: url("${minimap}");
      position: absolute;
      top: 49px;
      left: 0px;
      width: 500px;
      height: 500px;
    }
    .wide {
      display: flex;
      flex-direction: column;
      width: 70%;
    }
    .narrow {
      width: 30%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .editor {
      width: 100%;
      height: 100%;
    }
    .video {
      width: 100%;
      height: 100%;
      border-top: 2px solid ${colors.dark};
    }
    .title {
      cursor: default;
      margin-right: 2%;
      width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .top {
      display: flex;
      height: 50%;
      flex-direction: column;
      flex-grow: 1;
    }
    .bottom {
      display: flex;
      height: 50%;
      flex-direction: column;
      flex-grow: 1;
    }
    .switchButtons {
      font-size: calc(10px + 0.3vw);
      background-color: ${colors.androidGreen};
      color: ${colors.dark};
      border: none;
      font-family: ${FONT};
      font-weight: 900;
      display: flex;
      width: 100%;
      height: 40px;
      flex-direction: row;
      justify-content: center;
    }
    .infoViewButton {
      border-right: 1px solid ${colors.dark};
    }
    .chatViewButton {
      border-left: 1px solid ${colors.dark};
    }
    .infoViewButton,
    .chatViewButton {
      width: 50%;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
    }
    .infoViewButton:hover,
    .chatViewButton:hover {
      color: ${colors.lavenderGrey};
    }
    .infoBox {
      background-color: ${colors.lavenderGrey};
      border-top: 2px solid ${colors.dark};
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      font-family: ${FONT};
      overflow-y: auto;
      flex-grow: 1;
    }
    .chatBox {
      position: relative;
      background-color: white;
      width: 100%;
      display: flex;
      align-items: center;
      font-family: ${FONT};
      overflow-y: auto;
      flex-grow: 1;
      border-top: 2px solid ${colors.dark};
    }
    .gitter {
      position: absolute;
      align-self: flex-start;
      width: 166.4%;
      height: 176.5%;
      transform: translate(-19.95%, -23.35%) scale(0.6);
    }
    .welcome code {
      white-space: pre-wrap;
      font-family: ${FONT};
    }
    .welcome {
      font-size: calc(10px + 0.3vw);
      padding: 0 5%;
      color: ${colors.dark};
    }`
  return css
}
