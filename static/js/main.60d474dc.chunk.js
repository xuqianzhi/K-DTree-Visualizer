(this["webpackJsonpneighbor-finding-visualizer"]=this["webpackJsonpneighbor-finding-visualizer"]||[]).push([[0],[,,,,,,,,,,,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){},,function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);var i=n(1),o=n.n(i),a=n(7),s=n.n(a),r=(n(14),n.p,n(15),n(2)),c=n(3),u=n(6),d=n(5),l=n(4),h=(n(16),n(0)),p=37.871416963460454,g=-122.26007750513202;function m(t){var e=window.mapData.map;if(e&&t){var n=Math.pow(2,e.getZoom()),i=new window.google.maps.LatLng(e.getBounds().getNorthEast().lat(),e.getBounds().getSouthWest().lng()),o=e.getProjection().fromLatLngToPoint(i),a=e.getProjection().fromLatLngToPoint(t.getPosition());return{x:Math.floor((a.x-o.x)*n),y:Math.floor((a.y-o.y)*n)}}}var w=function(t){Object(d.a)(n,t);var e=Object(l.a)(n);function n(t){var i;return Object(r.a)(this,n),(i=e.call(this,t)).visualizeKDTree=i.props.visualizeKDTree,i.state={},i}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.fetchGoogleMapsAPIScript()}},{key:"fetchGoogleMapsAPIScript",value:function(){this.initMap=this.initMap.bind(this);var t=document.createElement("script");t.setAttribute("id","loadmap-script"),t.async=!0,t.src="https://maps.googleapis.com/maps/api/js?key=".concat("AIzaSyAquzNVhFe5cmvQxJKz6_g5A5dKNzDC0qo","&libraries=places&v=weekly"),t.type="text/javascript",t.onload=this.initMap,document.getElementById("map-container").appendChild(t)}},{key:"initMap",value:function(){var t=this,e=window.google;window.mapData.nearestInfowindow=new window.google.maps.InfoWindow({content:"Nearest Search Result"});var n=new e.maps.LatLng(p,g),i=new e.maps.Map(document.getElementById("map"),{center:n,zoom:14,mapTypeId:"roadmap",mapTypeControl:!1,fullscreenControl:!1,styles:[{stylers:[{lightness:0}]}]}),o=document.createElement("button");o.setAttribute("id","visualization-button"),window.mapData.nearest_position?(o.textContent="Restart",o.onclick=function(){t.restartButtonClicked()}):(o.textContent="Visualize K-D Tree",o.onclick=this.visualizeKDTree),i.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(o);var a={url:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png",size:new e.maps.Size(71,71),origin:new e.maps.Point(0,0),anchor:new e.maps.Point(17,34),scaledSize:new e.maps.Size(35,35)},s=new e.maps.Marker({map:i,icon:a,title:"UC Berkeley",position:n}),r=document.getElementById("pac-input"),c=new e.maps.places.SearchBox(r);i.controls[e.maps.ControlPosition.TOP_LEFT].push(r),i.addListener("bounds_changed",(function(){c.setBounds(i.getBounds())}));var u=window.mapData.markers,d=[];if(0!=u.length){var l=new e.maps.LatLngBounds;l.extend(s.getPosition());var h=this.findNearestMarker(u);(h||0===h)&&(window.mapData.nearest_position.index=h);for(var w=0;w<u.length;w++){var v=u[w],f=null;w==h&&(f=e.maps.Animation.BOUNCE),v.setMap(null);var x={size:new e.maps.Size(71,71),origin:new e.maps.Point(0,0),anchor:new e.maps.Point(17,34),scaledSize:new e.maps.Size(25,25)},b={lat:v.getPosition().lat(),lng:v.getPosition().lng()},y=v.getTitle();d.push(new e.maps.Marker({map:i,icon:x,title:y,position:b,animation:f})),l.extend(b)}i.fitBounds(l)}window.mapData.markers=d,window.mapData.searchBox=c,window.mapData.ucb_marker=s,window.mapData.map=i,c.addListener("places_changed",(function(){window.mapData.nearest_position=null,window.mapData.nearestInfowindow=null;var o=document.getElementById("visualization-button");o.textContent="Visualize K-D Tree",o.onclick=t.visualizeKDTree;var a=c.getPlaces();if(0!=a.length){d.forEach((function(t){t.setMap(null)})),d=[];var s=new e.maps.LatLngBounds;s.extend(n),a.forEach((function(t){if(t.geometry&&t.geometry.location){var n={size:new e.maps.Size(71,71),origin:new e.maps.Point(0,0),anchor:new e.maps.Point(17,34),scaledSize:new e.maps.Size(25,25)};d.push(new e.maps.Marker({map:i,icon:n,title:t.name,position:t.geometry.location})),t.geometry.viewport?s.union(t.geometry.viewport):s.extend(t.geometry.location),1==a.length&&alert("Only 1 place is found, which will display trivial visualization \n \n Try search general terms to display more places, e.g. Mcdonalds, Ramen")}else console.log("Returned place contains no geometry")})),console.log("reach here"),window.mapData.markers=d,i.fitBounds(s)}}));e.maps.event.addListener(i,"bounds_changed",(function(){if(!window.mapData.nearest_position){var t=window.mapData.ucb_marker,o=window.mapData.markers.slice();o.push(t);for(var a=!1,s=0;s<o.length;s++){var r=m(o[s]),c=r.x,u=r.y;if(c<=0||u<=0||c>=window.innerWidth||u>=window.innerHeight){a=!0;break}}if(a)if(alert("You are about to drag or zoom some marker out of view port, which will affect neighbor searching visualization"),1==o.length)i.setZoom(14),i.setCenter(n);else{var d=new e.maps.LatLngBounds;o.forEach((function(t){d.extend(t.getPosition())})),i.fitBounds(d)}}}))}},{key:"restartButtonClicked",value:function(){window.mapData.nearest_position=null,window.mapData.nearestInfowindow=null;var t=document.getElementById("visualization-button");t.textContent="Start Visualization",t.onclick=this.visualizeKDTree;var e=window.google,n=window.mapData.map,i=window.mapData.markers,o=new e.maps.LatLng(p,g);console.log("marker is ",i),i.forEach((function(t){t.setMap(null)})),window.mapData.markers=[],n.setZoom(14),n.setCenter(o),document.getElementById("pac-input").style.display="inline-block"}},{key:"findNearestMarker",value:function(t){var e=window.mapData.nearest_position;if(e){var n=Number.MAX_VALUE,i=null;if(t&&0!=t.length){for(var o=0;o<t.length;o++){var a=t[o].getPosition(),s=Math.pow(a.lat()-e.lat,2)+Math.pow(a.lng()-e.lng,2);s<=n&&(n=s,i=o)}return i}}}},{key:"render",value:function(){return Object(h.jsx)("div",{id:"map-container",children:Object(h.jsxs)("div",{children:[Object(h.jsx)("input",{id:"pac-input",class:"controls",type:"text",placeholder:"Search Google Maps"}),Object(h.jsx)("div",{id:"map"})]})})}}]),n}(i.Component),v=(n(18),n(22));function f(t,e,n,i){return Math.sqrt(Math.pow(t-e,2)+Math.pow(n-i,2))}var x=function(){function t(e){Object(r.a)(this,t),this.position=e}return Object(c.a)(t,[{key:"setIsVertical",value:function(t){this.isVertical=t}},{key:"getPosition",value:function(){return this.position}},{key:"getIsVertical",value:function(){if(this.isVertical)return this.isVertical}}]),t}(),b=function(){function t(e,n,i,o){Object(r.a)(this,t),this.position=e,this.x_bound=n,this.y_bound=i,this.isVertical=o}return Object(c.a)(t,[{key:"getPosition",value:function(){return this.position}},{key:"getIsVertical",value:function(){return this.isVertical}},{key:"getXBound",value:function(){return this.x_bound}},{key:"getYBound",value:function(){return this.y_bound}}]),t}(),y=function(){function t(e,n,i){Object(r.a)(this,t),this.dots=e,this.root_dot=e[Math.floor(e.length/2)],this.root=new j(!0,this.root_dot,n,i),this.root.sortCoordinates(e,!0),this.root.constructTree(e)}return Object(c.a)(t,[{key:"getRoot",value:function(){return this.root}},{key:"iterateTree",value:function(){var t=this.getRoot(),e=[];return t&&t.iterate(e),e}},{key:"getNodeTraversedAfterInsertion",value:function(t){var e=this.getRoot(),n=[];return e&&e.getNodeTraversedAfterInsertion(n,t),n}},{key:"performNearestSearching",value:function(t){var e=t.x,n=t.y,i=this.getNodeTraversedAfterInsertion(t);i.pop();for(var o=i[i.length-1],a=o.getPosition().x,s=o.getPosition().y,r=f(e,a,n,s),c=o,u=new Set,d=[],l=[];0!=i.length;){if(o=i.pop(),u.add(o.getID()),f(e,a=o.getPosition().x,n,s=o.getPosition().y)<=r&&(r=f(e,a,n,s),c=o),o.right&&!u.has(o.right.getID())){o.intersectDownOrRight(e,n,r)?(i.push(o.right),d.push(o)):d.push(null);var h=o.isVertical?"right":"down";l.push({length:r,direction:h})}if(o.left&&!u.has(o.left.getID())){o.intersectUpOrLeft(e,n,r)?(i.push(o.left),d.push(o)):d.push(null);h=o.isVertical?"left":"up";l.push({length:r,direction:h})}}return{nearest:c,bound_animation:d,crossing_animation:l}}}]),t}(),j=function(){function t(e,n,i,o){Object(r.a)(this,t),this.isVertical=e,this.dot=n,this.dot.setIsVertical(e),this.x_bound=i,this.y_bound=o,this.line=new b(n.getPosition(),i,o,e),this.id=Object(v.a)()}return Object(c.a)(t,[{key:"getID",value:function(){return this.id}},{key:"getLine",value:function(){return this.line}},{key:"getPosition",value:function(){return this.getDot().getPosition()}},{key:"getDot",value:function(){return this.dot}},{key:"getIsVertical",value:function(){return this.isVertical}},{key:"getXBound",value:function(){return this.x_bound}},{key:"getYBound",value:function(){return this.y_bound}},{key:"sortCoordinates",value:function(t,e){e?t.sort((function(t,e){var n=t.getPosition().x,i=e.getPosition().x;return n<i?-1:n>i?1:0})):t.sort((function(t,e){var n=t.getPosition().y,i=e.getPosition().y;return n<i?-1:n>i?1:0}))}},{key:"constructTree",value:function(e){if(!(e.length<=1)){var n=e.slice(0,Math.floor(e.length/2)),i=e.slice(Math.floor(e.length/2)+1,e.length);if(this.sortCoordinates(n,!this.isVertical),this.sortCoordinates(i,!this.isVertical),0!=n.length){var o,a,s=n[Math.floor(n.length/2)];this.isVertical?(o={min:this.x_bound.min,max:this.dot.position.x},a=this.y_bound):(o=this.x_bound,a={min:this.y_bound.min,max:this.dot.position.y}),this.left=new t(!this.isVertical,s,o,a),this.left.constructTree(n)}if(0!=i.length){var r,c,u=i[Math.floor(i.length/2)];this.isVertical?(r={min:this.dot.position.x,max:this.x_bound.max},c=this.y_bound):(r=this.x_bound,c={min:this.dot.position.y,max:this.y_bound.max}),this.right=new t(!this.isVertical,u,r,c),this.right.constructTree(i)}}}},{key:"iterate",value:function(t){t.push(this),this.left&&this.left.iterate(t),this.right&&this.right.iterate(t)}},{key:"getNodeTraversedAfterInsertion",value:function(t,e){var n=e.x,i=e.y,o=this.getDot().getPosition().x,a=this.getDot().getPosition().y;return t.push(this),this.isVertical?n<o?this.left?this.left.getNodeTraversedAfterInsertion(t,e):(t.push(this.getInsertedDestinationNode(e,o,a)),t):this.right?this.right.getNodeTraversedAfterInsertion(t,e):(t.push(this.getInsertedDestinationNode(e,o,a)),t):i<a?this.left?this.left.getNodeTraversedAfterInsertion(t,e):(t.push(this.getInsertedDestinationNode(e,o,a)),t):this.right?this.right.getNodeTraversedAfterInsertion(t,e):(t.push(this.getInsertedDestinationNode(e,o,a)),t)}},{key:"getInsertedDestinationNode",value:function(e,n,i){var o,a,s=e.x,r=e.y;this.isVertical?(a=this.y_bound,o=s<n?{min:this.x_bound.min,max:this.dot.position.x}:{min:this.dot.position.x,max:this.x_bound.max}):(o=this.x_bound,a=r<i?{min:this.y_bound.min,max:this.dot.position.y}:{min:this.dot.position.y,max:this.y_bound.max});var c=new x(e);return new t(!this.isVertical,c,o,a)}},{key:"getNodesTraversedAfterClosestSearching",value:function(t,e){var n=e.x,i=e.y;f(n,t[t.length-1].getPosition().x,i,t[t.length-1].getPosition().y)}},{key:"intersectUpOrLeft",value:function(t,e,n){return this.isVertical?t-n<=this.getPosition().x:e-n<=this.getPosition().y}},{key:"intersectDownOrRight",value:function(t,e,n){return this.isVertical?t+n>=this.getPosition().x:e+n>=this.getPosition().y}}]),t}(),D=n(8),k=1500,A=200;var T=function(t){Object(d.a)(n,t);var e=Object(l.a)(n);function n(t){var i;return Object(r.a)(this,n),(i=e.call(this,t)).state={tree_nodes:[],searching_bound:{x_bound:{min:0,max:window.innerWidth},y_bound:{min:0,max:window.innerHeight}},animation_speed:2,radar_radius:20,radar_direction:"up",running_status:"constructing"},i}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var t=this,e=window.mapData.markers,n=this.markerToPixelDots(e),i=this.getKDTree(n);this.KDTree=i;var o=i.iterateTree(),a=[];o.forEach((function(t){a.push({node:t,is_dot_displayed:!1,is_line_displayed:!1,drawing_line_length:0})})),this.setState({tree_nodes:a}),setTimeout((function(){t.displaySearchingAnimation()}),1e3)}},{key:"markerToPixelDots",value:function(t){var e=window.mapData.map;if(e){var n=Math.pow(2,e.getZoom()),i=new window.google.maps.LatLng(e.getBounds().getNorthEast().lat(),e.getBounds().getSouthWest().lng()),o=e.getProjection().fromLatLngToPoint(i),a=[];return t.forEach((function(t){if(t){var i=e.getProjection().fromLatLngToPoint(t.getPosition()),s={x:Math.floor((i.x-o.x)*n),y:Math.floor((i.y-o.y)*n)};a.push(new x(s))}})),a}}},{key:"getLatLngFromPixelOffset",value:function(t){var e=window.mapData.map;if(e){var n=Math.pow(2,e.getZoom()),i=new window.google.maps.LatLng(e.getBounds().getNorthEast().lat(),e.getBounds().getSouthWest().lng()),o=e.getProjection().fromLatLngToPoint(i),a=t.x/n,s=t.y/n,r=new window.google.maps.Point(a+o.x,s+o.y),c=e.getProjection().fromPointToLatLng(r);return{lat:c.lat(),lng:c.lng()}}}},{key:"getUCBDot",value:function(){var t=[window.mapData.ucb_marker],e=this.markerToPixelDots(t)[0].getPosition();return new x(e)}},{key:"getKDTree",value:function(t){t.sort((function(t,e){var n=t.getPosition().x,i=e.getPosition().x;return n<i?-1:n>i?1:0}));var e={min:0,max:window.innerWidth},n={min:0,max:window.innerHeight};return new y(t,e,n)}},{key:"drawBoundAnimatedly",value:function(t,e,n,i){for(var o=this,a=25,s=n,r=n.x_bound.min,c=n.x_bound.max,u=n.y_bound.min,d=n.y_bound.max,l=i.x_bound,h=i.y_bound,p=l.min-r,g=l.max-c,m=h.min-u,w=h.max-d,v=function(n){var i=r+p*((n+1)/a),l=c+g*((n+1)/a),h=u+m*((n+1)/a),v=d+w*((n+1)/a);setTimeout((function(){s.x_bound={min:i,max:l},s.y_bound={min:h,max:v},o.setState({searching_bound:s})}),t+e*(n/a))},f=0;f<a;f++)v(f)}},{key:"drawLineAnimatedly",value:function(t,e,n,i){for(var o=this,a=function(a){setTimeout((function(){var t=0;t+=n*((a+1)/20),o.setState({radar_radius:t,radar_direction:i,running_status:"searching"})}),t+e*(a/20))},s=0;s<20;s++)a(s)}},{key:"drawColoredDotAtTime",value:function(t,e,n,i){setTimeout((function(){document.getElementById(e).style.backgroundColor="crimson",n&&(document.getElementById(n).style.backgroundColor=i)}),t)}},{key:"drawLine",value:function(t,e,n,i,o,a,s,r){var c="up"==a||"down"==a;return"right"===a||"down"==a?Object(h.jsx)("div",{className:"line",style:c?{left:"".concat(t,"px"),top:"".concat(e,"px"),backgroundColor:o,borderRadius:"".concat(r,"px"),height:"".concat(n,"px"),display:s,width:"".concat(i,"px")}:{left:"".concat(t,"px"),top:"".concat(e,"px"),backgroundColor:o,borderRadius:"".concat(r,"px"),width:"".concat(n,"px"),display:s,height:"".concat(i,"px")}}):Object(h.jsx)("div",{className:"line",style:c?{right:"".concat(window.innerWidth-t-i+1,"px"),bottom:"".concat(window.innerHeight-e,"px"),height:"".concat(n,"px"),display:s,width:"".concat(i,"px"),backgroundColor:o,borderRadius:"".concat(r,"px")}:{right:"".concat(window.innerWidth-t,"px"),bottom:"".concat(window.innerHeight-e-i+1,"px"),width:"".concat(n,"px"),display:s,height:"".concat(i,"px"),backgroundColor:o,borderRadius:"".concat(r,"px")}})}},{key:"displaySearchingAnimation",value:function(){var t=this,e=1/Math.pow(2,this.state.animation_speed),n=this.state.tree_nodes;n.forEach((function(t){t.is_dot_displayed=!1,t.is_line_displayed=!1})),this.setState({tree_nodes:n,running_status:"constructing"});for(var i=function(i){var o=n[i];setTimeout((function(){o.is_dot_displayed=!0,t.setState({tree_nodes:n})}),k*e*i),setTimeout((function(){o.is_line_displayed=!0,t.setState({tree_nodes:n})}),k*e*i+A)},o=0;o<n.length;o++)i(o);for(var a=k*e*n.length+A,s=this.getUCBDot(),r={x:s.getPosition().x,y:s.getPosition().y},c=this.KDTree.getNodeTraversedAfterInsertion(r),u=this.KDTree.performNearestSearching(r),d=u.nearest,l=u.bound_animation,h=u.crossing_animation,p=d.getID(),g=this.state.searching_bound,m=0;m<c.length;m++){var w=c[m],v={x_bound:w.getXBound(),y_bound:w.getYBound()},f=a+k*e*m,x=k*e;this.drawBoundAnimatedly(f,x,g,v),g=v}a+=k*e*(c.length+1);setTimeout((function(){t.setState({running_status:"searching"})}),a);for(var b=0;b<l.length;b++){var y=l[b],j=h[b],D=j.length,T=j.direction,B=a+k*e*2*b,P=k*e;if(this.drawLineAnimatedly(B,P,D,T),y){var O=a+k*e*(2*b+1),I={x_bound:{min:Math.min(g.x_bound.min,y.getXBound().min),max:Math.max(g.x_bound.max,y.getXBound().max)},y_bound:{min:Math.min(g.y_bound.min,y.getYBound().min),max:Math.max(g.y_bound.max,y.getYBound().max)}};this.drawBoundAnimatedly(O,P,g,I),g=I}}a+=k*e*l.length*2,setTimeout((function(){t.setState({running_status:"none"});var e=document.getElementById(p);e.style.backgroundColor="crimson",e.style.opacity=1;for(var n=document.getElementsByClassName("line"),i=0;i<n.length;i++)n[i].style.opacity=.3}),a+A),setTimeout((function(){var e=d.getPosition(),n=t.getLatLngFromPixelOffset(e);window.mapData.nearest_position=n,t.props.KDTreeToMap()}),a+A+1500)}},{key:"render",value:function(){var t=this,e=this.getUCBDot(),n=this.state.tree_nodes,i=this.state.searching_bound.x_bound.min,o=this.state.searching_bound.x_bound.max,a=this.state.searching_bound.y_bound.min,s=this.state.searching_bound.y_bound.max,r=this.state.radar_radius,c=this.state.radar_direction,u=this.state.running_status,d="searching"==u?"inline-block":"none";return Object(h.jsxs)("div",{className:"visualizer-container",children:[Object(h.jsx)(D.a,{trigger:Object(h.jsx)("button",{style:{right:"4px",bottom:"4px",width:"35px",height:"35px",position:"absolute",borderRadius:"5px",backgroundImage:"url(".concat("/K-DTree-Visualizerquestion-mark.png",")"),opacity:.5,backgroundSize:"cover",backgroundPosition:"center"}}),position:"top right",on:["hover","focus"],arrow:!0,children:"constructing"===u?Object(h.jsx)("div",{className:"popup-container",children:" Constructing K-D Tree "}):"searching"===u?Object(h.jsxs)("div",{className:"popup-container",style:{textAlign:"left"},children:[Object(h.jsx)("div",{children:" Searching... "}),Object(h.jsx)("div",{style:{marginTop:"5px",marginBottom:"10px"},children:" * Yellow bar: best distance found so far "}),Object(h.jsx)("div",{style:{backgroundColor:"gold",borderRadius:"".concat(2,"px"),width:"".concat(100,"px"),height:"".concat(5,"px")}}),Object(h.jsx)("div",{style:{height:"10px"}})]}):Object(h.jsx)("div",{className:"popup-container",children:" Nearest neighbor found "})}),Object(h.jsx)("div",{className:"bound",id:"bound-top",style:{height:"".concat(5,"px"),left:i,top:a,width:o-i,marginTop:"".concat(-2.5,"px")}}),Object(h.jsx)("div",{className:"bound",id:"bound-bottom",style:{height:"".concat(5,"px"),left:i,top:s,width:o-i,marginTop:"".concat(-2.5,"px")}}),Object(h.jsx)("div",{className:"bound",id:"bound-left",style:{width:"".concat(5,"px"),left:i,top:a,height:s-a,marginLeft:"".concat(-2.5,"px")}}),Object(h.jsx)("div",{className:"bound",id:"bound-right",style:{width:"".concat(5,"px"),left:o,top:a,height:s-a,marginLeft:"".concat(-2.5,"px")}}),Object(h.jsx)("div",{className:"dot",style:{left:"".concat(e.getPosition().x,"px"),top:"".concat(e.getPosition().y,"px"),backgroundColor:"blue"}}),this.drawLine(e.getPosition().x-2.5,e.getPosition().y-2.5,r,5,"gold",c,d,4),n.map((function(e,n){var i=e.node,o=(i.getDot(),i.getLine()),a=e.is_dot_displayed,s=e.is_line_displayed,r=i.getID();"none"==u&&(a=!1);var c=o.getIsVertical(),d=o.getPosition().x,l=o.getPosition().y,p=o.getXBound(),g=o.getYBound(),m=a?1:.3,w=s?"inline-block":"none",v=c?"rgb(187, 145, 248)":"mediumaquamarine",f=a?v:"crimson",x=c?d-1:p.min,b=c?g.min:l-1,y=c?g.max-g.min:p.max-p.min,j=c?"down":"right";return Object(h.jsxs)("div",{children:[Object(h.jsx)("div",{className:"dot",id:r,style:{left:d,top:l,opacity:m,backgroundColor:f}}),t.drawLine(x,b,y,2,v,j,w,1)]})}))]})}}]),n}(i.Component),B=(n(19),function(t){Object(d.a)(n,t);var e=Object(l.a)(n);function n(t){var i;return Object(r.a)(this,n),(i=e.call(this,t)).state={viewToDisplay:w},i.visualizeKDTree=i.visualizeKDTree.bind(Object(u.a)(i)),i.KDTreeToMap=i.KDTreeToMap.bind(Object(u.a)(i)),i}return Object(c.a)(n,[{key:"visualizeKDTree",value:function(){var t=this,e=window.mapData.markers;if(e&&0!=e.length){for(var n=window.mapData.map,i=function(t){setTimeout((function(){var e=[{stylers:[{lightness:-50-20*t}]}];n.setOptions({styles:e})}),400*t)},o=0;o<3;o++)i(o);setTimeout((function(){t.setState({viewToDisplay:T})}),1200)}else alert("Please search some locations before visualization \n \n e.g. McDonalds, Ramen")}},{key:"KDTreeToMap",value:function(){this.setState({viewToDisplay:w}),document.getElementById("pac-input").style.display="none",setTimeout((function(){if(window.mapData.nearest_position){var t=window.google,e=window.mapData.markers,n=window.mapData.ucb_marker,i=window.mapData.map,o=window.mapData.nearest_position.index;e.forEach((function(t){t.setMap(null)}));var a=window.mapData.markers[o],s=new t.maps.LatLngBounds;s.extend(n.getPosition()),s.extend(a.getPosition()),a.setAnimation(null),a.setMap(i),i.fitBounds(s),window.mapData.nearestInfowindow.open({anchor:a,map:i,shouldFocus:!1})}}),3e3)}},{key:"render",value:function(){var t=this.state.viewToDisplay,e=window.mapData.shouldPopUpDisplay?"inline-block":"none";return window.mapData.shouldPopUpDisplay=!1,Object(h.jsxs)("div",{children:[Object(h.jsx)(D.a,{position:"right center",defaultOpen:!0,children:Object(h.jsxs)("div",{id:"popup-container",style:{display:e},children:[Object(h.jsx)("h3",{className:"popup-h3-text",children:"Welcome to K-D Tree Visualizer!"}),Object(h.jsx)("h6",{className:"popup-h6-text",children:"K-D Tree is a powerful space-partitioning data structure that is widely used for nearest neighbor searching in map applications."}),Object(h.jsx)("h6",{className:"popup-h6-text",children:"So, what would it looks like behind the scene if Google Maps uses K-D tree for nearest neighbor searching? This visualizer present you the searching process near UC Berkeley among locations of your choice."}),Object(h.jsx)("img",{width:"300px",height:"300px",src:"data:image/png;base64,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"}),Object(h.jsx)("p",{children:"Click the map to start"})]})}),Object(h.jsx)(t,{visualizeKDTree:this.visualizeKDTree,KDTreeToMap:this.KDTreeToMap})]})}}]),n}(i.Component));var P=function(){return window.mapData={map:null,searchBox:null,ucb_marker:null,markers:[],nearest_position:null,nearestInfowindow:null,shouldPopUpDisplay:!0},Object(h.jsx)(B,{})},O=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,23)).then((function(e){var n=e.getCLS,i=e.getFID,o=e.getFCP,a=e.getLCP,s=e.getTTFB;n(t),i(t),o(t),a(t),s(t)}))};s.a.render(Object(h.jsx)(o.a.StrictMode,{children:Object(h.jsx)(P,{})}),document.getElementById("root")),O()}],[[20,1,2]]]);
//# sourceMappingURL=main.60d474dc.chunk.js.map