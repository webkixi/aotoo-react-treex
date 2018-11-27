
const {
  list,
  objTypeof,
  transTree,
  find,
  findIndex,
  merge,
  isArray,
  isFunction,
  isString,
  isObject,
  isDomElement,
  uniqueId,
  filter
} = Aotoo

const isNumber = function (obj) {
  return objTypeof(obj) == 'Number'
}

const bars = {
    trigger:  <div className="treex-bar"><div className="treex-trigger-bar">加载更多内容</div></div>
  , pulldown: <div className="treex-bar"><div className="treex-pull-bar">刷新页面</div></div>
  , loading:  <div className="treex-bar"><div className="treex-loading">Loading...</div></div>
  , over:     <div className="treex-bar"><div className="treex-over-bar">没有更多内容了</div></div>
}

function getBehaviorBar(type, val){
  if (val) {
    switch (type) {
      case 'pulldown':
        return val == true ? bars.pulldown : val
        break;
      case 'loading':
        return val == true ? bars.loading : val
        break;
      case 'over':
        return val == true ? bars.over : val
        break;
      case 'trigger':
        return val == true ? bars.trigger : val
        break;
    }
  }
}

class Tree extends React.Component {
  constructor(props){
    super(props)
    this.preRender = this::this.preRender
    this.state = {
      data: this.props.data || [],
      pulldown: this.props.pulldown || false,
      loading: this.props.loading || false,
      trigger: this.props.trigger || false,
      over: this.props.over || false
    }
  }

  preRender(){
    const header = this.props.header ? this.props.header : ''
    const footer = this.props.footer ? this.props.footer : ''

    const list_part = list({
      data: transTree(this.state.data),
      listClass: this.props.listClass,
      itemClass: this.props.itemClass,
      itemMethod: this.props.itemMethod
    })

    if (
      header ||
      footer ||
      this.state.trigger ||
      this.state.pulldown ||
      this.state.loading ||
      this.state.over
    ) {
      return (
        <div className="list-container">
          {getBehaviorBar('pulldown', this.state.pulldown)}
          {header}
          {list_part}
          {footer}
          {getBehaviorBar('trigger', this.state.trigger)}
          {getBehaviorBar('over', this.state.over)}
          {getBehaviorBar('loading', this.state.loading)}
        </div>
      )
    } else {
      return list_part
    }
  }

  render(){
    return this.preRender()
  }
}

const Actions = {
  UPDATE: function(ostate, opts={}, control){
    let state = this.curState
    let data = state.data

    const index = opts.index
    if (!index && index!=0) {
      if (isArray(opts.data)) {
        const [treeKeys, treeData] = setItemKey(opts.data)
        control.saxer.set('treeKeys', treeKeys||[])
        state.data = treeData
        return state
      }
    } else {
      let oriData = data[index]
      let oldKey = oriData.key
      let newKey = getHashKey()
      updateTreeKeys(control, oldKey, newKey)
      state.data[index] = merge(oriData, opts.data, {key: newKey})
      return state
    }
  },

  APPEND: function(ostate, opts={}, control){
    let state = this.curState
    let data = state.data
    let oTreeKeys = control.saxer.get('treeKeys')
    let appendData = [].concat(opts.data || [])
    // appendData.startIndex = oTreeKeys.length

    const [treeKeys, treeData] = setItemKey(appendData)
    oTreeKeys = oTreeKeys.concat(treeKeys)
    control.saxer.set('treeKeys', oTreeKeys||[])
    data = data.concat(treeData)

    state.data = data
    return state
  },

  PREPEND: function(ostate, opts={}, control){
    let state = this.curState
    let data = state.data
    let oTreeKeys = control.saxer.get('treeKeys')
    let prependData = [].concat(opts.data || [])

    const [treeKeys, treeData] = setItemKey(prependData)
    oTreeKeys = treeKeys.concat(oTreeKeys)
    
    control.saxer.set('treeKeys', oTreeKeys||[])
    data = treeData.concat(data)

    state.data = data
    return state
  },

  /*
    opts:{
      index: {number}
      query: {Json}
    }
  */
  DELETE: function(ostate, opts={}, control){
    let state = this.curState
    let data = state.data
    let oTreeKeys = control.saxer.get('treeKeys')

    if (opts.index || opts.index == 0) {
      const tIndex = findIndex(data, {attr: {'data-treeid': opts.index}})

      let oriItem = data[tIndex] 
      // let oriItem = data[opts.index] 
      let oldKey = oriItem.key
      if (oriItem) {
        updateTreeKeys(control, oldKey)
        data.splice(tIndex, 1);
      }
    }
    else if(opts.query) {
      const index = findIndex(data, opts.query)
      let oriItem = data[index]
      let oldKey = oriItem.key
      if (oriItem) {
        updateTreeKeys(control, oldKey)
        data.splice(index, 1)
      }
    }
    state.data = data
    return state
  },

  // ========== 状态控制 ===========

  LOADING: function(ostate, opts={}){
    let state = this.curState
    if (!state.over) {
      state.loading = opts.loading || true
      state.pulldown = false
    }
    return state
  },

  LOADED: function(ostate, opts={}){
    let state = this.curState
    if (!state.over) {
      state.loading = false
      state.pulldown = false
    }
    return state
  },

  OVER: function(ostate, opts={}){
    let state = this.curState
    state.loading = false
    state.pulldown = false
    state.trigger = false
    state.over = opts.over || true
    return state
  },

  PULLDOWN: function(ostate, opts={}){
    let state = this.curState
    state.loading = false
    state.over = false
    state.pulldown = opts.pulldown || true
    return state
  },

  TRIGGER: function(ostate, opts={}){
    if (!this||!this.state) return
    let state = this.curState
    state.loading = false
    state.pulldown = false
    state.over = false
    state.trigger = opts.trigger || true
    return state
  },
}

let idrecode = []
let indexcode = []
function _getGroups(dataAry, idf){
  let nsons = []

  let sons = filter(dataAry, (o, jj) => {
    if (o.parent == idf) {
      indexcode.push(jj)
      return o.parent == idf
    }
  })

  sons.forEach( (son, ii) => {
    if (son.idf && idrecode.indexOf(son.idf) == -1) {
      idrecode.push(son.idf)
      nsons = nsons.concat(son).concat(_getGroups(dataAry, son.idf))
    } else {
      nsons = nsons.concat(son)
    }
  })
  return nsons
}

// let myParentsIndex = []
// let myParents = []

/**
 * [查找特定idf的数据，]
 * @param  {[type]} dataAry [description]
 * @param  {[type]} idf     [description]
 * @return {[type]}         [description]
 */
function findParents(dataAry, idf){
  let _parentIndex
  const myParents = []
  const item = find(dataAry, (o,ii)=>o.idf==idf)

  if (item && item.parent) {
    const p = find(dataAry, (o, ii)=>{
      _parentIndex = ii
      return o.idf==item.parent
    })
    if (p){
      myParents.push({index: _parentIndex, content: p})
      myParents.concat(findParents(dataAry, item.parent))
    }
  }
  return myParents
}

function updateTreeKeys(control, oldkey, newKey) {
  const treeKeys = control.saxer.get('treeKeys')
  let ii = findIndex(treeKeys, {hashKey: oldkey})
  if (newKey) {
    treeKeys[ii].key = newKey
  } else {
    treeKeys.splice(ii, 1);
  }
}

function valideIndex(index) {
  return index || index == 0 ? true : false
}

function getHashKey(prefix="treex_") {
  return uniqueId(prefix)
}

function saveTreeKeys(control, params) {
  params = params ? [].concat(params) : []
  control.saxer.set('treeKeys', params)
  // if (params.length) {
  // }
}

function setItemKey(datas=[], depth=0, parentIndex, hkey, part) {
  const myData = []
  const myKeys = []
  let start = datas.startIndex||0

  for (let ii = 0, jj = start; ii < datas.length; ii++, jj++) {
    let item = datas[ii]
    const itemKey = getHashKey()
    let keyItem = valideIndex(parentIndex)
    // ? { index: jj, hashKey: itemKey, depth: depth, belong: { index: parentIndex, hashKey: hkey, part: part } }
    ? { index: jj, hashKey: itemKey, depth: depth, belong: { hashKey: hkey, part: part } }
    : { index: jj, hashKey: itemKey, depth: depth}
    myKeys.push(keyItem)

    if (isString(item) || isNumber(item) || React.isValidElement(item)) {
      const newItem = {title: item, key: itemKey}
      myData.push(newItem)
    } 
    else if (isObject(item)) {
      item.key = item.key||itemKey
      const [subItemKeys, newItem] = setSubItemKey(item, jj, itemKey, ++depth)
      myKeys.concat(subItemKeys)
      myData.push(newItem)
    }
  }
  
  return [myKeys, myData]
}

function setSubItemKey(item, index, hashKey, depth) {
  let _liKeys=[], _bodyKeys=[], _ftKeys=[], _dotKeys=[]
  if (item.li) {
    let li = [].concat(item.li)
    let [liKeys, liData] = setItemKey(li, depth, index, hashKey, 'li')
    _liKeys = liKeys
    item.li = liData
  }

  if (item.body) {
    let body = [].concat(item.body)
    let [bodyKeys, bodyData] = setItemKey(body, depth, index, hashKey, 'body')
    _bodyKeys = bodyKeys
    item.body = bodyData
  }

  if (item.footer) {
    let footer = [].concat(item.footer)
    let [ftKeys, ftData] = setItemKey(footer, depth, index, hashKey, 'footer')
    _ftKeys = ftKeys
    item.footer = ftData
  }

  if (item.dot) {
    let dot = [].concat(item.dot)
    let [dotKeys, dotData] = setItemKey(dot, depth, index, hashKey, 'dot')
    _dotKeys = dotKeys
    item.dot = dotData
  }

  const itemKeys = [..._liKeys, ..._bodyKeys, ..._ftKeys, ..._dotKeys]
  return [itemKeys, item]
}

function App(opts){
  const [treeKeys, treeInitData] = setItemKey(opts.props.data)
  opts.props.data = treeInitData || []
  const treeX = Aotoo(Tree, Actions, opts)
  saveTreeKeys(treeX, treeKeys)
  treeX.extend({
    // 重写setProps方法
    setProps: function (props = {}) {
      if (props.data) {
        const [treeKeys, treeInitData] = setItemKey(props.data)
        props.data = treeInitData || []
        saveTreeKeys(this, treeKeys)
        this.config.props = props
      }
    },
    // 重写setConfig方法
    setConfig: function (config = {}) {
      if (config.props && config.props.data) {
        const [treeKeys, treeInitData] = setItemKey(config.props.data)
        config.props.data = treeInitData || []
        saveTreeKeys(this, treeKeys)
        this.config = config
      }
    },
    update: function(params) {
      this.$update(params)
    },
    append: function(params) {
      this.$append(params)
    },
    prepend: function(params) {
      this.$prepend(params)
    },
    delete: function(params) {
      const that = this
      if (params) {
        if (Array.isArray(params)) {
          params.forEach(function(param) {
            setTimeout(() => {
              that.$delete(param)
            }, 50);
          })
        } else {
          this.$delete(params)
        }
      }
    },
    loading: function(params) {
      this.$loading(params)
    },
    loaded: function(params) {
      this.$loaded(params)
    },
    over: function(params) {
      this.$over(params)
    },
    pulldown: function(params) {
      this.$pulldown(params)
    },
    trigger: function(params) {
      this.$trigger(params)
    },
    /**
     * data {Array} 完整的数据
     * idf  {String}  指定父级id
     * feather  {Boolean}  true = 是否返回完整数据，false = 返回完整的ID
     */
    getGroups: function(data, idf, feather){
      data = data||this.data||[]
      idrecode = []
      indexcode = []
      const index = findIndex(data, o=>o.idf==idf)
      indexcode.push(index)
      let groups = _getGroups(data||[], idf)
      // if (feather) return groups
      if (feather) {
        let temp = []
        indexcode.forEach( $id => {
          let sonFeather = data[$id]
          sonFeather['__index'] = $id
          temp.push(sonFeather)
        })
        return temp
      }
      return indexcode
    },

    getParents: function(data, idf){
      data = data||this.data||[]
      return findParents(data, idf)
    },

    findAndUpdate: function(query, target){
      const data = this.data||[]
      if (query) {
        const index = findIndex(data, query)
        if (index) {
          this.dispach('UPDATE', {
            index: index,
            data: target
          })
        }
      }
    }
  })
  return treeX
}

export default function tree(opts){
  let dft = {
    props: {
      data: [],
      loading: false,
      header: '',
      footer: '',
      itemClass: '',
      listClass: '',
      itemMethod: ''
    },
    theme: '',
    autoinject: true,
    rendered: ''
  }
  dft = merge(dft, opts)
  return App(dft)
}

export function pure(opts){
  return tree(opts)
}
