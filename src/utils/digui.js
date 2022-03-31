
var data = [
  { id: 1, name: "办公管理", pid: 0 },
  { id: 2, name: "请假申请", pid: 1 },
  { id: 3, name: "出差申请", pid: 0 },
  { id: 4, name: "请假记录", pid: 2 },
  { id: 5, name: "系统设置", pid: 1 },
  { id: 6, name: "权限管理", pid: 5 },
  { id: 7, name: "用户角色", pid: 3 },
  { id: 8, name: "菜单设置", pid: 6 },
  { id: 9, name: "菜单设置1", pid: 7 },
  { id: 10, name: "菜单设置2", pid: 2 },

];
function toTree (data) {
  var map = {};
  data.forEach(function (item) {
    map[item.id] = item;
  });
  var val = [];
  data.forEach(function (item, index) {
    var parent = map[item.pid];
    if (parent) {
      parent.children = [];
      parent?.children?.push(item);
    } else {
      val.push(item);
    }
  });
  return val;

}
// toTree(data);
function digui (data, arr, pid) {
  data.forEach(element => {
    if (element.pid === pid) {
      element.children = [];
      arr.push(element);
      digui(data, arr.find(e => e.id === element.id).children, element.id);
    }
   return arr
  });
}
digui(data, [], 0);
