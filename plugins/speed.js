let os = require('os')
let util = require('util')
let { performance } = require('perf_hooks')
let { sizeFormatter } = require('human-readable')
let format = sizeFormatter({
  std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})
let handler = async (m, { conn }) => {
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) //groups.filter(v => !v.read_only)
  const used = process.memoryUsage()
  const cpus = os.cpus().map(cpu => {
  const more = String.fromCharCode(8206)
  const readMore = more.repeat(4001)
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })
  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })
  let old = performance.now()
  await m.reply('_eeeeeeee..._')
  let neww = performance.now()
  let speed = neww - old
  m.reply(`${speed} ms

💻 *Informasi Server Miko* :
RAM: *${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}*

💬 *Informasi Chat Bot :*
- *${groupsIn.length}* Groups Joined
- *${chats.length - groupsIn.length}* Chat Pribadi
- *${chats.length}* Total Chats`.trim())
}
handler.help = ['ping', 'speed']
handler.tags = ['info']

handler.command = /^(ping|speed|m|p)$/i
module.exports = handler