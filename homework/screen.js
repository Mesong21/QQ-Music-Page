
function test() {
  const myContainer = document.querySelector('.item-container');
  myContainer.innerHTML = 'Hello World!';
}
// test();


// 获取JSON数据
function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}


function addItem(index, item, item_rows) {

  let date = new Date(item.pubdate);
  let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  var item_innerHTML = `
      <li>
        <div class="mv-image">
        <a href="#${item.title}" target=_blank>
          <img src="${item.picurl}" alt="${item.title}" />
        </a>
          
        </div>
        <p><a class="mv-title">${item.title}</a></p>
        <p><a class="mv-singers">${item.singers[0].name}</a></p>
        <p class="mv-pubdate">${formattedDate}</p>
      </li>`;
  item_rows += item_innerHTML;

  return item_rows;
}
// 生成列表
function generateList(data) {
  // 解析filterRule.js中的数据
  const imageContainer = document.querySelector('.image-container');
  // const itemContainer = document.querySelector('.item-container');
  let item_rows = '';
  let index = 0;
  const area_version = document.querySelectorAll('.area-selected, .version-selected');

  let title_str = '';
  let res_title = document.querySelector('.res-title');

  area_id = parseInt(area_version[0].id);
  version_id = parseInt(area_version[1].id);
  console.log('area_id: ',  area_id, 'version_id: ', version_id);

  imageContainer.innerHTML = '';
  data.forEach(item => {
    if (area_id === 0 && version_id === 0) {
      item_rows = addItem(index, item, item_rows);
      title_str = `<span class="all_id">全部MV</span>`;
      index++;
      // console.log(index);
    } else if (area_id === 0 && version_id !== 0) {
      let version_type = document.querySelector(`.version a[id="${version_id}"]`);
      title_str = `
        <span class="version_id" id=${version_id}>
          ${version_type.innerText}
          <a class="delete_version">x</a>
        </span>`;
      if (item.verison === version_id) {
        item_rows = addItem(index, item, item_rows);
        index++;
        // console.log(index);
      }
    } else if (area_id !== 0 && version_id === 0) {
      let area_type = document.querySelector(`.area a[id="${area_id}"]`);
      title_str = `
        <span class="area_id" id=${area_id}>
          ${area_type.innerText}
          <a class="delete_area">x</a>
        </span>
      `;
      if (item.area === area_id) {
        item_rows = addItem(index, item, item_rows);
        index++;
        // console.log(index);
      }
    } else if (area_id !== 0 && version_id !== 0) {
      let area_type = document.querySelector(`.area a[id="${area_id}"]`);
      let version_type = document.querySelector(`.version a[id="${version_id}"]`);
      title_str = `
        <span class="area_id" id=${area_id}>
          ${area_type.innerText}
          <a class="delete_area">x</a>
        </span>
        <span class="version_id" id=${version_id}>
          ${version_type.innerText}
          <a class="delete_version">x</a>
        </span>
      `;
      if (item.area === area_id && item.verison === version_id) {
        item_rows = addItem(index, item, item_rows);
        index++;
        // console.log(index);
      }
    }
    res_title.innerHTML = title_str;
  });
  imageContainer.innerHTML = item_rows;
}



// 添加筛选点击事件监听器
document.querySelectorAll('.guide.new-hot a, .guide.area a:not([type="title"]), .guide.version a:not([type="title"])').forEach(a => {
  a.addEventListener('click', event => {
    event.preventDefault();
    // 点击的元素的祖先元素的类
    const _class = event.target.getAttribute('class');
    // console.log(_class);
    const guide_class = event.target.parentElement.parentElement.getAttribute('class');
    // console.log(guide_class);
    const _id = event.target.getAttribute('id');
    // console.log(_id);

    if (_id === 'new') {
      event.target.classList.add('new-selected');
      document.getElementById('hot').classList.remove('hot-selected');
    } else if (_id === 'hot') {
      event.target.classList.add('hot-selected');
      document.getElementById('new').classList.remove('new-selected');
    } else {
      if (guide_class === 'guide area') {
        document.querySelectorAll('.guide.area a:not([type="title"])').forEach(a => {
          a.classList.remove('area-selected');
        });
        event.target.classList.add(`area-selected`);
      } else if (guide_class === 'guide version') {
        document.querySelectorAll('.guide.version a:not([type="title"])').forEach(a => {
          a.classList.remove('version-selected');
        });
        event.target.classList.add(`version-selected`);
      }
    }
    let new_hot = document.querySelector('.hot-selected, .new-selected');
    // console.log(new_hot);
    fetchData(`data/${new_hot.id}.json`).then(data => generateList(data));
  });
});

// 对.delete_area和.delete_version添加事件监听器
document.querySelectorAll('span').forEach(a => {
  a.addEventListener('click', event => {
    event.preventDefault();
    const _class = event.target.getAttribute('class');
    if (_class === 'delete_area') {
      document.querySelectorAll('.guide.area a:not([type="title"])').forEach(a => {
        a.classList.remove('area-selected');
      });
      // .guide.area的id=0的元素
      document.querySelector('.guide.area a[id="0"]').classList.add('area-selected');
    } else if (_class === 'delete_version') {
      document.querySelectorAll('.guide.version a:not([type="title"])').forEach(a => {
        a.classList.remove('version-selected');
      });
      // .guide.version的id=0的元素
      document.querySelector('.guide.version a[id="0"]').classList.add('version-selected');
    }
    let new_hot = document.querySelector('.hot-selected, .new-selected');
    fetchData(`data/${new_hot.id}.json`).then(data => generateList(data));
  });
});

window.onload = function () {
  fetchData('./data/new.json').then(data => generateList(data));
  document.getElementById('new').classList.add('new-selected');
  document.querySelector('.guide.area a[id="0"]').classList.add('area-selected');
  document.querySelector('.guide.version a[id="0"]').classList.add('version-selected');
};