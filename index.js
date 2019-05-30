let colors = {
    2: 'rgb(238, 228, 218)',
    4: 'rgb(237, 224, 200)',
    8: 'rgb(242, 177, 121)',
    16: 'rgb(245, 149, 99)',
    32: 'rgb(246, 124, 95)',
    64: 'rgb(246, 94, 59)',
    128: 'rgb(237, 207, 114)',
    256: 'rgb(237, 204, 97)',
    512: 'rgb(237, 200, 80)',
    1024: 'rgb(237, 197, 63)',
    2048: 'rgb(237, 194, 46)',
  }
  // box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
  let N = [
  // column: 直排
  // row: 橫排  
  // 0  1  2  3
    [0, 0, 0, 2], // 0  N[0][0], N[0][1], N[0][2], N[0][3]
    [0, 0, 0, 0], // 1  N[1][0], N[1][1], N[1][2], N[1][3]
    [0, 0, 0, 0], // 2  N[2][0], N[2][1], N[2][2], N[2][3]
    [0, 0, 0, 0], // 3  N[3][0], N[3][1], N[3][2], N[3][3]
  ]
  let inited = false
  function init () {
    if (!inited) {
      random(true)
      random(true)
      print()
      inited = true
    }
  }
  print()
  console.log('isGoableLeft():', isGoableLeft())

  let inner = document.getElementById('inner')
  let touchsurface = document.getElementById('board')
  let x = null
  let y = null

  touchsurface.addEventListener('touchstart', function(e){
    var obj = e.changedTouches[0]
    x = obj.pageX
    y = obj.pageY
    e.preventDefault()
  }, false)

  touchsurface.addEventListener('touchmove', function(e){
    var obj = e.changedTouches[0]
    e.preventDefault() // prevent scrolling when inside DIV
  }, false)

  touchsurface.addEventListener('touchend', function(e){
    let obj = e.changedTouches[0]
    let dx = obj.pageX - x
    let dy = obj.pageY - y

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        goLeft()
      } else if (dx > 0) {
        goRight()
      }
    } else {
      if (dy < 0) {
        goUp()
      } else if (dy > 0) {
        goDown()
      }
    }
    e.preventDefault()
  }, false)
}

  
  function padNumber (n) {
    if (n === 0) return '    '
    if (n >= 1000) return `${n}`
    if (n >= 100) return ` ${n}`
    if (n >= 10) return `  ${n}`
    return `   ${n}`
  }
  function print () {
    let cells = document.querySelectorAll('div.cell')
    for (let i = 0; i < cells.length; i = i + 1) {
      let r = Math.floor(i / 4)
      let c = i % 4
      // console.log(cells[i].textContent)
      if (N[r][c] > 0) {
        cells[i].innerHTML = N[r][c]
        cells[i].style.backgroundColor = colors[N[r][c]]
      } else {
        cells[i].innerHTML = ''
        cells[i].style.backgroundColor = 'rgba(238, 228, 218, 0.35)'
      }

      if (N[r][c] >= 8) {
        cells[i].style.color = 'white'
      } else {
        cells[i].style.color = 'black'
      }
    }
    return
    
    let lines = []
    for (const ns of N) {
      let numbers = []
      for (const n of ns) {
        numbers.push(padNumber(n))
      }
      lines.push('+----+----+----+----+')
      lines.push('|' + numbers.join('|') + '|')
    }
    lines.push('+----+----+----+----+')
    console.log(lines.join('\n'))

  }
  
  function mergeUp () {
    // 一個直排 A[0] A[1] A[2] A[3]
    // -> 四個直排
    //    0 號直排：N[0][0] N[1][0] N[2][0] N[3][0]
    //    1 號直排：N[0][1] N[1][1] N[2][1] N[3][1]
    //    2 號直排：N[0][2] N[1][2] N[2][2] N[3][2]
    //    3 號直排：N[0][3] N[1][3] N[2][3] N[3][3]
    for (let c = 0; c < 4; c = c + 1) {
      for (let r = 0; r < 3; r = r + 1) {
        if (N[r][c] === N[r + 1][c]) {
          N[r][c] = N[r][c] + N[r][c]
          N[r + 1][c] = 0
        }
      }
    }
  }
  function mergeDown () { 
    for (let c = 0; c < 4; c = c + 1) {
      for (let r = 3; r > 0; r = r - 1) {
        if (N[r][c] === N[r - 1][c]) {
          N[r][c] = N[r][c] + N[r][c]
          N[r - 1][c] = 0
        }
      }
    }
  }
  function mergeLeft () {
    for (let r = 0; r < 4; r = r + 1) {
      for (let c = 0; c < 3; c = c + 1) {
        if (N[r][c] === N[r][c + 1]) {
          N[r][c] = N[r][c] + N[r][c]
          N[r][c + 1] = 0
        }
      }
    }
  }
  function mergeRight () {
    for (let r = 0; r < 4; r = r + 1) {
      for (let c = 3; c > 0; c = c - 1) {
        if (N[r][c] === N[r][c - 1]) {
          N[r][c] = N[r][c] + N[r][c]
          N[r][c - 1] = 0
        }
      }
    }
  }
  function moveUp () {
    // 1. 找到第一個空的 -> target
    // 2. 按順序找所有不是空的，看是否需要移到動到 target
    //    如果有移動的話，target = target + 1
    for (let c = 0; c < 4; c = c + 1) {
      let target = null
      for (let r = 0; r < 4; r = r + 1) {
        let n = N[r][c]
        if (n === 0 && target === null) target = r
        if (n > 0 && target !== null) {
          N[target][c] = N[r][c]
          N[r][c] = 0
          target = target + 1
        }
      }
    }
  }
  function moveDown () {
    for (let c = 0; c < 4; c = c + 1) {
      let target = null
      for (let r = 3; r >= 0; r = r - 1) {
        let n = N[r][c]
        if (n === 0 && target === null) target = r
        if (n > 0 && target !== null) {
          N[target][c] = N[r][c]
          N[r][c] = 0
          target = target - 1
        }
      }
    }
  }
  function moveLeft () {
    for (let r = 0; r < 4; r = r + 1) {
      let target = null
      for (let c = 0; c < 4; c = c + 1) {
        let n = N[r][c]
        if (n === 0 && target === null) target = c
        if (n > 0 && target !== null) {
          N[r][target] = N[r][c]
          N[r][c] = 0
          target = target + 1
        }
      }
    }
  }
  function moveRight () {
    for (let r = 0; r < 4; r = r + 1) {
      let target = null
      for (let c = 3; c >= 0; c = c - 1) {
        let n = N[r][c]
        if (n === 0 && target === null) target = c
        if (n > 0 && target !== null) {
          N[r][target] = N[r][c]
          N[r][c] = 0
          target = target - 1
        }
      }
    }
  }
  function isFull () {
    for (let r = 0; r < 4; r = r + 1){
      for (let c = 0; c < 4; c = c + 1){
        if (N[r][c] === 0){
          return false
        }
      }
    }
    return true     
  }
  function isMergeable () {
    for (let r = 0; r < 4; r = r + 1){
      for (let c = 0; c < 3; c = c + 1){
        if  (N[r][c] > 0 && N[r][c] === N[r][c+1]){
          return true
        }
      }
    }  
    for (let r = 0; r < 3; r = r + 1) {
      for (let c = 0; c < 4; c = c + 1){
        if (N[r][c] > 0 && N[r][c] === N[r+1][c]){
          return true
        }
      }
    }
    return false
  }
  function isGameover () {
  // return isGoableUp() || isGoableDown() || isGoableLeft() || isGoableRight()  
    return isFull() && !isMergeable()
  }
  
  function random2or4 () {
    // 隨機決定要放 2 還是 4
    if (Math.random() >= 0.5) {
      return 2
    } else {
      return 4
    }
  }
  
  function random () {
    // 先把空的取出來
    let rows = []
    let columns = []
    for (let r = 0; r < 4; r = r + 1) {
      for (let c = 0; c < 4; c = c + 1) {
        if (N[r][c] === 0) {
          rows.push(r)
          columns.push(c)
        }
      }
    }
    // 隨機選一個
    let i = Math.floor(Math.random() * rows.length)
    let r = rows[i]
    let c = columns[i]
    // 放上去！
    N[r][c] = random2or4()
  }
  
  function isGoableUpDown (begin, end, step) {
    for (let c = 0; c < 4; c = c + 1) {
      let meetEmpty = false
      for (let r = begin; r!== end; r = r + step) {
        if (N[r][c] === 0) {
          meetEmpty = true
        }
        if (N[r][c] > 0 && meetEmpty) {
          return true
        }
      }
      
      for (let r = begin; r!== end-step; r = r + step) {
        if (N[r][c] > 0 && N[r][c] === N[r + step][c]) {
          return true
        }
      }
    }
    return false
  }
  
  function isGoableUp () {
    return	isGoableUpDown (0, 4, 1)
  }
  function isGoableDown () {
    return isGoableUpDown (3, -1, -1)
  }
  
  function isGoableLeftRight (begin, end, step) {
    for (let r = 0; r < 4; r = r + 1) {
      let meetEmpty = false
      for (let c = begin; c!== end; c = c + step) {
        if (N[r][c] === 0) {
          meetEmpty = true
        }
        if (N[r][c] > 0 && meetEmpty) {
          return true
        }
      } 
       for (let c = begin; c!== end-step; c = c + step) {
        if (N[r][c] > 0 && N[r][c] === N[r][c + step]) {
          return true
        }
      }
    }
    return false
  }
  
  function isGoableLeft () {
    return isGoableLeftRight (0, 4, 1)
  }
  function isGoableRight () {
    return isGoableLeftRight (3, -1, -1)
  }
  
  
  window.onkeydown = function (e) {
    if (isGameover()) {
      console.log('Gameover!')
      return
    }
    let changed = false  
    if (e.code === 'ArrowUp' && isGoableUp()) {
      moveUp()
      mergeUp()
      moveUp()
      changed = true
    } else if (e.code === 'ArrowDown' && isGoableDown()) {
      moveDown()
      mergeDown()
      moveDown()
      changed = true
    } else if (e.code === 'ArrowLeft' && isGoableLeft()) {
      moveLeft()
      mergeLeft()
      moveLeft()
      changed = true
    } else if (e.code === 'ArrowRight' && isGoableRight()) {
      moveRight()
      mergeRight()
      moveRight()
      changed = true
    }
    if (changed) {
      random()
      print()
    }
  }  