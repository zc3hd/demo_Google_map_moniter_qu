/**
 * Item Name  : 
 *Creator         :cc
 *Email            :cc
 *Created Date:2017.1.16
 *@pararm     :
 */
(function($, window) {

  function diyGMap(opts) {
    // 地图容器标识
    this.id = opts.id;

    // 谷歌的地图的全局变量
    this.Gmap = google.maps;
    // 地图的收集
    this.map = null;

    // 收集所有区的数据
    this.p_arr = [];
    // 点击区的收集器
    this.p_qu = null;


    // 区下面实时数据的刷新时间
    this.time_qu_xm_update = 2000;
    // 区下面实时数据的定时器
    this.timer_qu_xm = null;
    // 模拟数据
    this.qu_xm_all_Data = {
      all: [
        { "id": 1, "position": { "lng": 116.554384, "lat": 39.980178, }, name: '设备1' },
        { "id": 2, "position": { "lng": 116.545384, "lat": 39.950178, }, name: '设备2' },
      ]
    };
    // 区下面监控数据的容器
    this.qu_xm_arr = [];
    // 区下面数据最优显示
    this.qu_viewPort_key = true;
    // 退出到区的返回按钮
    this.back_to_qu = null;


    // 追踪容器
    this.zz_p = null;
    // 追踪容器的信息框
    this.zz_p_label = null;
    // 收集所有的折线
    this.zz_p_line = [];
    // 追踪的数据
    this.zz_p_one_Data = {
      one: [
        { "id": 1, "position": { "lng": 116.554384, "lat": 39.980178, }, name: '设备1' },
      ]
    };
    // 追踪的刷新时间
    this.time_zz_p_update = 2000;
    // 追踪定时器
    this.timer_zz_p = null;
    // 返回到区下面的监控按钮
    this.back_to_qu_xm = null;

  };
  diyGMap.prototype = {
    // 入口函数
    init: function() {
      var me = this;
      // 初始控件和地图
      me.init_mapBaner()
        // 初始化事件
      me.init_event();
    },
    // -----------------------------------------组件初始
    //控件默认初始化
    init_mapBaner: function() {
      var me = this;
      me.map = new me.Gmap.Map($('#' + me.id)[0], {
        center: {
          lat: 39.920026,
          lng: 116.403694
        },
        zoom: 11,
        // 地图类型控件
        mapTypeControl: true,
        mapTypeControlOptions: {
          // 展示的形式
          // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          // 要地图类型的控件
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.TERRAIN,
            // google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID
          ],
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        // 缩放控件
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,

        // 全景模式开启
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });
      console.log(me.map);
    },
    //控件自定义初始化
    init_setBaner: function() {
      var me = this;
    },
    init_event: function() {
      var me = this;
      // -----------项目选择
      me.moniter_bind();
      me.moniter();
    },

    moniter: function(argument) {
      var me = this;
      me.m_init();
    },
    moniter_bind: function() {
      var me = this;
      var fn = {
        m_init: function(argument) {
          var me = this;
          // me.m_draw_p();
          me.m_all_data();
        },
        // ------------------------------------------------------------------所有数据的请求
        m_all_data: function(argument) {
          var me = this;
          // markerOBJ
          var marker_obj = null;

          // 收集marker
          var marker_arr = [];

          all_ajax();

          function all_ajax() {
            var data = {
              all: [
                { "id": 1, "position": { "lng": 116.364384, "lat": 39.980178, }, name: '区域1', count: 2 },
                { "id": 2, "position": { "lng": 116.854384, "lat": 39.450178, }, name: '区域2', count: 2 },
                { "id": 3, "position": { "lng": 116.784384, "lat": 39.960178, }, name: '区域3', count: 5 },
                { "id": 4, "position": { "lng": 116.124384, "lat": 39.230178, }, name: '区域4', count: 7 },
              ]
            }
            for (var i = 0; i < data.all.length; i++) {
              marker_obj = me.m_draw_p(data.all[i]);
              me.p_arr.push(marker_obj);
              marker_arr.push(marker_obj.marker);
            }
            // 设置最佳视角
            me.m_setVeiwPort(marker_arr);
          }
        },
        // marker
        m_draw_p: function(data) {
          var marker = new me.Gmap.Marker({
            position: {
              lat: data.position.lat,
              lng: data.position.lng
            },
            map: me.map,
            // title: '车牌号：',
          });
          marker.id = data.id;
          marker.addListener('click', function() {
            me.m_p_click(marker);
          });

          var str = '<div class="markLabel">' +
            '<span class="labelName" id="devName">名称：' + data.name +
            '<br />' +
            '<span class="" id="devReceive" >数量：' + data.count + '</span>' +
            '<br />' +
            '</span>' +
            '<div class="labelArrow"></div>' +
            '</div>';
          var infowindow = me.m_p_label(str);
          infowindow.open(me.map, marker);
          return { marker: marker, infowindow: infowindow };
        },
        // 标记的信息框
        m_p_label: function(argument) {
          var infoBubble2 = new InfoBox({
            content: argument,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-100, -90),
            zIndex: null,
            boxStyle: {
              background: "rgba(0,0,0,0.3)",
              // opacity: 0.75,
              width: "200px"
            },
            // closeBoxMargin: "10px 2px 2px 2px",
            // closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
          });
          return infoBubble2;
        },
        // ----------------------------------------------------------点击一个区进行区的实时监控
        m_p_click: function(dom) {
          var me = this;
          // 清除全部数据
          me.m_all_clear(me.p_arr);
          me.p_arr = [];

          // 记录点击区的那个dom
          me.p_qu = dom;
          console.log(dom.id);
          // 加载退出到区控件
          me.back_to_qu = document.createElement('div');
          new NewControl({
            p_dom: me.back_to_qu,
            map: me.map,
            offset: ['10px', 0, 0, '10px'],
            btns: ['退出监控tuij']
          }).init();
          me.map.controls[google.maps.ControlPosition.LEFT_TOP].push(me.back_to_qu);
          $('#dom_tuij').unbind().on('click', function() {
            // 清除控件
            me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.back_to_qu);
            // 清除数据
            if (me.qu_xm_arr.length != 0) {
              for (var i = 0; i < me.qu_xm_arr.length; i++) {
                me.qu_xm_arr[i].setMap(null);
              };
            }
            me.qu_xm_arr = [];
            clearTimeout(me.timer_qu_xm);
            // 最优视角重新打开
            me.qu_viewPort_key = true;
            // 全部数据
            me.m_all_data()

            // 重置点击区的标记
            me.p_qu = null;
          });

          // 收集每个maker
          var markerOBJ = null;
          // 请求数据，渲染数据
          qu_xm_moniter();

          function qu_xm_moniter() {
            // 清除点
            if (me.qu_xm_arr.length != 0) {
              for (var i = 0; i < me.qu_xm_arr.length; i++) {
                me.qu_xm_arr[i].setMap(null);
              };
            }
            me.qu_xm_arr = [];
            // 请求到数据进行打点
            var data = me.qu_xm_all_Data.all;
            for (var i = 0; i < data.length; i++) {
              markerOBJ = me.qu_xm_draw(data[i]);
              me.qu_xm_arr.push(markerOBJ);
            }

            if (me.qu_viewPort_key) {
              me.qu_viewPort_key = false;
              me.m_setVeiwPort(me.qu_xm_arr);
            }

            // 数据的驱动
            me.timer_qu_xm = setTimeout(function(argument) {
              // 变化
              data.forEach(function(item) {
                item.position.lng = item.position.lng + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
                item.position.lat = item.position.lat + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
              });
              console.log('区下面实时数据开始刷了。')
              qu_xm_moniter();
            }, me.time_qu_xm_update)
          }
        },
        // 监控的数据进行打点
        qu_xm_draw: function(data) {
          var me = this;
          var marker = new me.Gmap.Marker({
            position: {
              lat: data.position.lat,
              lng: data.position.lng
            },
            map: me.map,
            title: '设备号：' + data.name,
            icon: '../../../images/car_online.png'
          });
          marker.id = data.id;
          marker.addListener('click', function() {

            // 清除控件
            me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.back_to_qu);
            // 清除数据
            if (me.qu_xm_arr.length != 0) {
              for (var i = 0; i < me.qu_xm_arr.length; i++) {
                me.qu_xm_arr[i].setMap(null);
              };
            }
            me.qu_xm_arr = [];
            clearTimeout(me.timer_qu_xm);
            // 最优视角重新打开
            me.qu_viewPort_key = true;

            // 加载退出到区控件
            me.back_to_qu_xm = document.createElement('div');
            new NewControl({
              p_dom: me.back_to_qu_xm,
              map: me.map,
              offset: ['10px', 0, 0, '10px'],
              btns: ['退出追踪tuiz']
            }).init();
            me.map.controls[google.maps.ControlPosition.LEFT_TOP].push(me.back_to_qu_xm);
            
            $('#dom_tuiz').unbind().on('click', function() {
              // 清除控件
              me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.back_to_qu_xm);
              // 清除所有的折线数据
              if (me.zz_p_line.length != 0) {
                for (var i = 0; i < me.zz_p_line.length; i++) {
                  me.zz_p_line[i].setMap(null);
                };
              }
              me.zz_p_line = [];
              // 清除点
              me.zz_p.setMap(null);me.zz_p = null;
              me.zz_p_label.close();me.zz_p_label = null;

              clearTimeout(me.timer_zz_p);

              // 记录从哪个区进入的再次进行监控模式
              me.m_p_click(me.p_qu);
            });

            // 追踪开始实时
            me.qu_xm_p_click(marker);
          });
          return marker;
        },
        // --------------------------------------------------------点击一个监控的点进行追踪
        qu_xm_p_click: function(dom) {

          var data = me.zz_p_one_Data.one;
          var view_arr = [];
          if (me.zz_p == null) {
            // 根据ID请求到数据
            var marker = new me.Gmap.Marker({
              position: {
                lat: data[0].position.lat,
                lng: data[0].position.lng
              },
              map: me.map,
              icon: '../../../images/car_online.png',
              anchorPoint: new google.maps.Point({ x: 50, y: 50 })
            });
            var str = '<div class="markLabel">' +
              '<span class="labelName" id="devName">设备名称：' + data[0].name +
              '<br />' +
              '</span>' +
              '<div class="labelArrow"></div>' +
              '</div>';
            var infowindow = me.m_p_label(str);
            infowindow.open(me.map, marker);
            // 收集marker
            me.zz_p = marker;
            me.zz_p_label = infowindow;

            view_arr.push(marker);
          } else {
            var newPoint = new google.maps.LatLng(data[0].position.lat, data[0].position.lng);
            var oldPoint = me.zz_p.getPosition();
            // 收集所有的折线
            me.zz_p_line.push(me.qu_xm_p_line([oldPoint, newPoint]));
            // 移动到新的点上
            me.zz_p.setPosition(newPoint);
            view_arr.push(me.zz_p);
          }

          me.m_setVeiwPort(view_arr);

          me.timer_zz_p = setTimeout(function() {
            console.log('追踪数据开始刷了。')
            data.forEach(function(item) {
              item.position.lng = item.position.lng + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
              item.position.lat = item.position.lat + (Math.random() * Math.random() > 0.3 ? Math.random() * Math.random() : Math.random() * Math.random() * (0 - 1)) * 0.0005;
            });
            me.qu_xm_p_click(dom);
          }, me.time_zz_p_update);
        },
        qu_xm_p_line: function(arr) {
          // body... 
          var me = this;
          var flightPlanCoordinates = arr;
          var flightPath = new me.Gmap.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#21536d',
            strokeOpacity: 0.8,
            strokeWeight: 4
          });
          flightPath.setMap(me.map);
          return flightPath;
        },
        // ---------------------------------------------------------公用函数
        // 清除全部数据
        m_all_clear: function(arr) {
          /* body... */
          var me = this;
          // 清除数据，容器重置
          for (var i = 0; i < arr.length; i++) {
            // 清除点
            arr[i].marker.setMap(null);
            // 清除信息框
            arr[i].infowindow.close();
          };
        },
        // 设置最优视角
        m_setVeiwPort: function(arr) {
          /* body... */
          var me = this;
          var bounds = new me.Gmap.LatLngBounds();
          //读取标注点的位置坐标，加入LatLngBounds  
          for (var i = 0; i < arr.length; i++) {
            bounds.extend(arr[i].getPosition());
          }
          //调整map，使其适应LatLngBounds,实现展示最佳视野的功能
          me.map.fitBounds(bounds);
        },
      }
      for (k in fn) {
        me[k] = fn[k];
      };
    },
  };
  window["diyGMap"] = diyGMap;
})(jQuery, window);
