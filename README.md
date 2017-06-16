# aotoo-react-treex

## Install
```bash
// install
yarn add aotoo-react-treex
```

## USAGE  
Depends on aotoo this library, `Aotoo` is a global variable

```jsx
import Aotoo from 'aotoo'
import treex from 'aotoo-react-treex'

const _data = [ 
  {title: '', idf: 'aaa'},
  {title: 'abcfd', parent: 'aaa' },
  {title: 'bcasd', parent: 'aaa' },
  {title: 'aacwq', parent: 'aaa'},

  {title: <button>123</button>, idf: 'bbb'},
  {title: 'yyufs', parent: 'bbb'},
  {title: 'xfdsw', parent: 'bbb'},
  {title: 'xxxdsehh', parent: 'bbb'}, 
]

const treeList = treex({ data: _data })

// Render in the dom of the specified id  
treeList.render(id, function(dom){
  // dom => ul.li
  $(dom) ...
})

// ========  or 

treeList.rendered = function(dom){
  $(dom) ...
}
const box = (
  <div>
    {treeList.render()}
    <button>button</button>
  </div>
)

Aotoo.render(box, id)
```


## API  

#### $update(opts)
```jsx
// after `treeList.render(id)`，You can dynamically update the structure after you update the data(_data)

treeList.$update({
  index: 1,
  data: {title: 'hello world', parent: 'aaa' }
})

// ======== or 

treeList.$update({
  data: [
    {title: 'one'},
    ...
  ]
})
```
The above operation causes the structure to be re-rendered and the callback method `rendered` is executed again  

#### $append(opts)
```jsx
// after `treeList.render(id)`

treeList.$append({
  data: {title: 'hello world', parent: 'aaa' }
})

// ======== or 

treeList.$append({
  data: [
    {title: 'one'},
    ...
  ]
})
``` 
access the above operation, you can dynamically append the structure after you append the data(_data)  

#### $prepend(opts)
```jsx
// after `treeList.render(id)`

treeList.$prepend({
  data: {title: 'hello world', parent: 'aaa' }
})

// ======== or 

treeList.$prepend({
  data: [
    {title: 'one'},
    ...
  ]
})
``` 
access the above operation, you can dynamically prepend the structure after you prepend the data(_data)    

#### $delete(opts)
```jsx
// after `treeList.render(id)`

treeList.$delete({
  index: 1
})

// ======== or 

treeList.$delete({
  query: {title: 'abcfd'}
})
``` 
access the above operation, you can dynamically delete the structure after you delete the data(_data)   


## List status
#### $loading(opts)
```jsx
// after `treeList.render(id)`

treeList.$loading({
  loading: true || jsx dom
})
``` 
access the above operation, will show loading bar

#### $over(opts)
```jsx
// after `treeList.render(id)`

treeList.$over({
  over: true || jsx dom
})
``` 
access the above operation, will show over bar

#### $pulldown(opts)
```jsx
// after `treeList.render(id)`

treeList.$pulldown({
  pulldown: true || jsx dom
})
``` 
access the above operation, will show pulldown bar

#### $trigger(opts)
```jsx
// after `treeList.render(id)`

treeList.$trigger({
  trigger: true || jsx dom
})
``` 
access the above operation, will show trigger bar