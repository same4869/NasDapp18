var dappAddress = "n1kfSa8iJRCgnVw54tp4M24EBoDCsGmeWWP";
var hash = "3cfa2005903f5b4e8c015f76fab375c0e6485b7fddf15eeb3c0314166369430f";
var NebPay = require("nebpay");
var nebPay = new NebPay();
var timer;

function toast (text) {
  $('#toast').html(text);
  $('#toast').show();
  setTimeout(function () {
    $('#toast').addClass('toast-show');
    showToast()
  }, 300);
}

function showToast () {
  setTimeout(function () {
    $('#toast').removeClass('toast-show');
    setTimeout(function () {
      $('#toast').hide();
    }, 2300);
  }, 3000);
}

function openToast (text) {
  $('#toast').html(text);
  $('#toast').show();
  setTimeout(function () {
    $('#toast').addClass('toast-show');
  }, 300);
}

function closeToast () {
  setTimeout(function () {
    $('#toast').removeClass('toast-show');
    setTimeout(function () {
      $('#toast').hide();
    }, 400);
  }, 1000); 
}

function editToast (text) {
  $('#toast').html(text);
}

function init () {
  if (typeof nebPay.simulateCall == "undefined" || typeof nebPay.call == "undefined") {
    toast('检测到你未开启星云钱包插件,请启动星云钱包插件并刷新.')
    return
  }

  get();
}

$(function () {
  init();
})

// 动画
particleground(document.getElementById('foreground'), {
  dotColor: 'rgba(59, 129, 182, 1)',
  lineColor: 'rgba(255, 255, 255, 0.06)',
  minSpeedX: 0.3,
  maxSpeedX: 0.6,
  minSpeedY: 0.3,
  maxSpeedY: 0.6,
  density: 50000,
  curvedLines: false,
  proximity: 250,
  parallaxMultiplier: 10,
  particleRadius: 4
});
// 切换查看项目还是添加项目
$('#release').on('click', function () {
  var type = $(this).data('type');
  if (+type === 1) {
    $(this).find('img').attr('src', './img/close.png');
    $(this).find('div').html('取消发布');
    $(this).data('type', 2);
    $('#information').hide();
    $('#from').show();
  } else {
    $(this).find('img').attr('src', './img/release.png');
    $(this).find('div').html('发布我的融资信息');
    $(this).data('type', 1);
    $('#from').hide();
    $('#information').show();
  }
})

// 打开评论
$('#information').on('click', '.see-comment', function () {
  if ($(this).data('num') == '0') {
    toast('此条融资暂无评论...')
    return false 
  }

  var comment = $(this).parent().parent().find('.comment-arr');
  var addComment = $(this).parent().parent().find('.add-comment');
  if (comment.css('display') === 'none') {
    comment.show();
    addComment.hide();
  }
})
// 打开添加评论
$('#information').on('click', '.add-comment-btn', function () {
  var comment = $(this).parent().parent().find('.comment-arr');
  var addComment = $(this).parent().parent().find('.add-comment');
  if (addComment.css('display') === 'none') {
    comment.hide();
    addComment.show();
  }
})

// 检测评论输入文字 来修改提交评论按钮
$('#information').on('input', '.comment-input', function () {
  var val = $(this).val();
  var submit = $(this).parent().parent().find('.submit-comment')
  if (val) {
    submit.removeClass('disabled')
  } else {
    submit.addClass('disabled')
  }
})

// 所有输入框获取焦点以后都改变一下 border颜色
$('body').on('focus', 'input', function () {
  $(this).parent().addClass('focus')
})
$('body').on('blur', 'input', function () {
  $(this).parent().removeClass('focus')
})

// 监控添加项目那一堆输入框
function verification () {
  var name = $('#name').val();
  var quota = $('#quota').val();
  var content = $('#content').val();
  var progress = $('#progress').val();
  var use = $('#use').val();
  var mailbox = $('#mailbox').val();
  if (name && quota && content && progress && use && mailbox) {
    $('#submit').removeClass('disabled')
  } else {
    $('#submit').addClass('disabled')
  }
}
$('#name').on('input', function () {
  verification()
})
$('#quota').on('input', function () {
  verification()
})
$('#content').on('input', function () {
  verification()
})
$('#progress').on('input', function () {
  verification()
})
$('#use').on('input', function () {
  verification()
})
$('#mailbox').on('input', function () {
  verification()
})


function get (name, value, time) {
  if (!name) {
    openToast('正在加载中请稍等...')
  }
  nebPay.simulateCall(dappAddress, "0", "get", JSON.stringify([]), {
    listener: function (res) {
      if(res.result == '' && res.execute_err == 'contract check failed') {
          editToast('合约检测失败，请检查浏览器钱包插件环境！');
          closeToast()
          return;
      }

      var data = JSON.parse(JSON.parse(res.result));
      console.log(data, 'data')
      if (name) {
        if (name === 'id') {
          for (var i = 0; i < data.length; i++) {
            if (data[i].id == value) {
              renderHtml(data);
              clearInterval(timer);
              editToast('信息添加成功!');
              closeToast();
              $('#release').find('img').attr('src', './img/release.png');
              $('#release').find('div').html('发布我的融资信息');
              $('#release').data('type', 1);
              $('#from').hide();
              $('#information').show();
            }
          }
        }

        if (name === 'time') {
          console.log('time')
          for (var i = 0; i < data.length; i++) {
            console.log(data[i].id, value, '11111')
            if (data[i].id == value) {
              for (var y = 0; y < data[i].comment.length; y++) {
                console.log(data[i].comment[y].time, time, '222222')
                if (data[i].comment[y].time == time) {
                  renderHtml(data);
                  clearInterval(timer);
                  editToast('信息添加成功!');
                  closeToast()
                }
              }
            }
          }
        }

      } else {
        renderHtml(data);
        closeToast();
      }
    }
  })
}

// 提交新项目
$('#submit').on('click', function () {
  var name = $('#name').val();
  var quota = $('#quota').val();
  var content = $('#content').val();
  var progress = $('#progress').val();
  var use = $('#use').val();
  var mailbox = $('#mailbox').val();
  var id = Date.now() +'_'+ ~~(Math.random() * 1e6);
  if (name && quota && content && progress && use && mailbox) {
    openToast('正在提交中请稍等...');
    nebPay.call(dappAddress, "0", "set", JSON.stringify([{
      id: id,
      name: name,
      quota: quota,
      content: content,
      progress: progress,
      use: use,
      mailbox: mailbox,
      time: Date.now()
    }]), { 
      listener: function(res){
        if (res.txhash) {
          editToast('系统正在尝试拉去信息中......请稍等 并不要操作页面');
          timer = setInterval(function () {
            get('id', id)
          }, 5000)
        } else {
          editToast('信息添加失败,请稍后再试');
          closeToast()
        }
      }
    })
  } else {
    toast('请填写完整信息');
  }
});

// 格式化时间搓的
function getTime (data) {
  var myDate = new Date(+data);
  var year = myDate.getFullYear();
  var months = myDate.getMonth() + 1;
  var month = months.toString().length === 2 ? months : '0' + months;
  var date = myDate.getDate().toString().length === 2 ? myDate.getDate() : '0' + myDate.getDate();
  var hours = myDate.getHours().toString().length === 2 ? myDate.getHours() : '0' + myDate.getHours();
  var minutes = myDate.getMinutes().toString().length === 2 ? myDate.getMinutes() : '0' + myDate.getMinutes();
  var seconds = myDate.getSeconds().toString().length === 2 ? myDate.getSeconds() : '0' + myDate.getSeconds();
  return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
}

// 添加评论
$('body').on('click', '.submit-comment', function () {
  var id = $(this).data('id');
  var text = $(this).parent().find('.comment-input').val();
  console.log(text);
  var time = Date.now();
  if (text) {
    openToast('正在提交中请稍等...');
    nebPay.call(dappAddress, "0", "addComment", JSON.stringify([id, text, time]), { 
      listener: function(res){
        if (res.txhash) {
          editToast('系统正在尝试拉去信息中......请稍等 并不要操作页面');
          timer = setInterval(function () {
            get('time', id, time)
          }, 5000)
        } else {
          editToast('信息添加失败,请稍后再试');
          closeToast()
        }
      }
    })
  } else {
    toast('请填写评论内容...')
  }
})

function renderHtml (data) {
  var html = '';
  console.log(data)
  for (var i = 0; i < data.length; i++) {
    html += '<div class="item"><div class="item-body">'
    + '<p><span>项目名称:</span> '+ data[i].name +'</p>'
    + '<p><span>项目融资额度:</span> '+ data[i].quota +'</p>'
    + '<p><span>项目介绍:</span> '+ data[i].content +'</p>'
    + '<p><span>项目进展:</span> '+ data[i].progress +'</p>'
    + '<p><span>资金用途:</span> '+ data[i].use +'</p>'
    + '<p><span>联系方式:</span> '+ data[i].mailbox +'</p>'
    + '<p><span>发布时间:</span> '+ getTime(data[i].time) +'</p></div>'
    + '<div class="comment"><div class="see-comment" data-num="'+data[i].comment.length+'"><img src="./img/comment.png" alt=""><span>'+data[i].comment.length+'条评论</span></div>'
    + '<div class="add-comment-btn">添加评论</div></div><div class="comment-arr">';
    
    for (var y = 0; y < data[i].comment.length; y++) {
      html += '<div class="comment-item">'
      + '<p>'+ data[i].comment[y].body+ '</p>'
      + '<p>'+ getTime(data[i].comment[y].time) +'</p></div>'
    }

    html += '</div><div class="add-comment"><div class="input"><input type="text" class="comment-input" placeholder="请输入评论...">'
    + '</div><div data-id="'+ data[i].id +'" class="submit-comment disabled">评论</div></div></div>';
  }

  $('#information').html(html);
}