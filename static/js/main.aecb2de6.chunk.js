(this["webpackJsonpschedule-planner"]=this["webpackJsonpschedule-planner"]||[]).push([[0],{106:function(e,t,a){},112:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(9),s=a.n(o),c=(a(85),a(28)),u=a.n(c),l=a(68),i=a(31),d=a(23),m=a(39),p=a(40),f=a(45),h=a(143),b=a(155),C=a(154),v=a(156),g=a(152),E=a(144),k=a(145),w=a(151),S=a(153),j=a(62),x=a.n(j),y=a(36),N=a.n(y),B=(a(60),function(e){function t(e){var a;Object(i.a)(this,t),(a=Object(m.a)(this,Object(p.a)(t).call(this,e))).onMouseEnter=function(){a.setState({isHovered:!0})},a.onMouseLeave=function(){a.setState({isHovered:!1})},a.onKeepChange=function(e){console.log(e),a.setState({keep:e})};var n=e.courseCode,r=e.keepable,o=e.keep,s=e.onDropClick;return a.courseCode=n,a.keepable=r,a.keep=o,a.onDropClick=s,a.state={isHovered:!1},a}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this.state.isHovered?{}:{visibility:"hidden"};return r.a.createElement("tr",{onClick:this.onClick,onMouseOver:this.onMouseEnter,onMouseOut:this.onMouseLeave},r.a.createElement("td",{style:{verticalAlign:"middle"}},this.courseCode),r.a.createElement("td",{style:{textAlign:"right"}},r.a.createElement(v.a,{size:"sm",variant:"outline-danger",style:e,className:"DropButton",onClick:this.onDropClick},"\u2715")))}}]),t}(r.a.Component)),I=a(64),O=a.n(I),A=(a(106),"4ad350333dc3859b91bcf443d14e4bf0"),M=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(m.a)(this,Object(p.a)(t).call(this,e))).loadCourseInfo=function(e){var t;return u.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:t=e.map((function(e){var t=e.split(" "),a=Object(l.a)(t,2),n=a[0],r=a[1];return"https://api.uwaterloo.ca/v2/courses/".concat(n,"/").concat(r,"/schedule.json")})),Promise.all(t.map((function(e){return N.a.get(e,{params:{key:A}})}))).then((function(e){var t=e.map((function(e){return e.data.data}));console.log(t),a.setState({courseInfo:t})}));case 2:case"end":return n.stop()}}))},a.parseCourses=function(e){e.split("\n").filter((function(e){return/^[0-9]{4}$/.test(e)}));var t=e.match(/[A-Z]{2,6} \d{1,3}[A-Z]? - /g).map((function(e){return e.substring(0,e.length-3)}));a.setState({currentCourses:t.map((function(e){return{courseCode:e,keepable:!0,keep:!0}}))}),console.log(t),a.loadCourseInfo(t)},a.showModal=function(){var e=a.state.rawCourses;a.setState({modalShow:!0}),a.parseCourses(e)},a.hideModal=function(){a.setState({modalShow:!1})},a.dropCourse=function(e){var t=a.state,n=t.currentCourses,r=t.courseInfo,o=n.filter((function(t){return t.courseCode!==e})),s=r.filter((function(t){var a=t[0],n=a.subject,r=a.catalog_number;return"".concat(n," ").concat(r)!==e}));a.setState({currentCourses:o,courseInfo:s}),a.render()},a.loadSubjects=function(){var e,t;return u.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return"https://api.uwaterloo.ca/v2/codes/subjects.json",n.next=3,u.a.awrap(N.a.get("https://api.uwaterloo.ca/v2/codes/subjects.json",{params:{key:A}}));case 3:e=n.sent,t=e.data.data.map((function(e){return e.subject})),a.setState({allSubjects:t});case 6:case"end":return n.stop()}}))},a.loadCourseNumbers=function(e){var t,n,r;return u.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:if(e){o.next=2;break}return o.abrupt("return");case 2:return t="https://api.uwaterloo.ca/v2/courses/".concat(e,".json"),o.next=5,u.a.awrap(N.a.get(t,{params:{key:A}}));case 5:n=o.sent,r=n.data.data.map((function(e){return e.catalog_number})),a.setState({courseNumbers:r});case 8:case"end":return o.stop()}}))},a.updateRawCourses=function(e){a.setState({rawCourses:e})},a.handleAddClick=function(){var e,t,n,r,o,s,c,l,i,d;return u.a.async((function(m){for(;;)switch(m.prev=m.next){case 0:return e=a.state,t=e.subjectBox,n=e.courseNumberBox,r=e.currentCourses,o=e.courseInfo,s="https://api.uwaterloo.ca/v2/courses/".concat(t,"/").concat(n,"/schedule.json"),m.next=4,u.a.awrap(N.a.get(s,{params:{key:A}}));case 4:if(c=m.sent,l="".concat(t," ").concat(n),200===c.data.meta.status){m.next=9;break}return alert("The course ".concat(l," is unavailable for this term.")),m.abrupt("return");case 9:if(!(i=r.slice()).filter((function(e){return l===e.courseCode})).length){m.next=12;break}return m.abrupt("return");case 12:i.push({courseCode:l,keepable:!1}),(d=o.slice()).push(c.data.data),a.setState({currentCourses:i,courseInfo:d});case 16:case"end":return m.stop()}}))},a.handleViewScheduleClick=function(){var e=a.state,t=(e.currentCourses,e.courseInfo);console.log(t);for(var n=t.map((function(e){return x.a.groupBy(e,(function(e){return e.section[4]}))})),r=[],o=function(e){var t=[];for(var a in n[e])t.push(n[e][a]);var o=t[0].map((function(e){var a=t.slice(1).map((function(t){var a=t.filter((function(t){return t.associated_class===e.associated_class}));return a.length||(a=t.filter((function(e){return 99===e.associated_class}))),a.map((function(e){return e.classNumber}))}));return[[e]].concat(a)}));r.push(o)},s=0;s<n.length;++s)o(s);console.log(r);var c={courses_info:t,filtered_courses:[]};console.log(c)},a.state={modalShow:!1,currentCourses:[],allSubjects:[],courseNumbers:[],subjectBox:"",courseNumberBox:"",showAlert:!1,rawCourses:"",courseInfo:[]},a}return Object(f.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){console.log("mounted"),this.loadSubjects()}},{key:"render",value:function(){var e=this,t=this.state,a=t.modalShow,n=t.currentCourses,o=t.allSubjects,s=t.courseNumbers;t.showAlert,t.subjectBox,t.courseNumberBox;return r.a.createElement("div",{className:"WelcomePage"},r.a.createElement("img",{src:O.a,alt:"Logo",className:"Logo"}),r.a.createElement(h.a,{className:"StepsDeck"},r.a.createElement(b.a,{className:"Card",border:"primary"},r.a.createElement(b.a.Header,{as:"h5"},"Step 1"),r.a.createElement(b.a.Body,null,r.a.createElement(b.a.Text,null,'Go to Quest and click "Class Schedule".'),r.a.createElement(b.a.Img,{src:"https://uwflow.com/static/img/import-schedule/step-1.png"}))),r.a.createElement(b.a,{className:"Card"},r.a.createElement(b.a.Header,{as:"h5"},"Step 2"),r.a.createElement(b.a.Body,null,r.a.createElement(b.a.Text,null,"Choose your term, then select all and copy."),r.a.createElement(b.a.Img,{src:"https://uwflow.com/static/img/import-schedule/step-2.png"}))),r.a.createElement(b.a,{className:"Card"},r.a.createElement(b.a.Header,{as:"h5"},"Step 3"),r.a.createElement(b.a.Body,null,r.a.createElement(b.a.Text,null,"Paste into the box below."),r.a.createElement(C.a,null,r.a.createElement(C.a.Group,null,r.a.createElement(C.a.Control,{as:"textarea",className:"PasteBox",rows:"15",onChange:function(t){return e.updateRawCourses(t.target.value)}})),r.a.createElement(v.a,{block:!0,onClick:this.showModal},"Next"))))),r.a.createElement(g.a,{size:"lg",show:a,onHide:this.hideModal},r.a.createElement(E.a,null,r.a.createElement(b.a,{className:"CourseEditCard",style:{overflowY:"scroll"}},r.a.createElement(k.a,{hover:!0},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Course"))),r.a.createElement("tbody",null,n.map((function(t){var a=t.courseCode,n=t.keepable,o=t.keep;return r.a.createElement(B,{key:a,courseCode:a,keepable:n,keep:o,onDropClick:function(){return e.dropCourse(a)}})}))))),r.a.createElement(b.a,{className:"CourseEditCard"},r.a.createElement(S.a,{className:"AutoCompleteInput",id:"subjectBox",options:o,renderInput:function(e){return r.a.createElement(w.a,Object.assign({},e,{label:"Subject",variant:"outlined",fullWidth:!0}))},fullWidth:!0,onSelect:function(t){e.loadCourseNumbers(t.target.value),e.setState({subjectBox:t.target.value.toUpperCase()})}}),r.a.createElement(S.a,{className:"AutoCompleteInput",id:"courseNumberBox",options:s,getOptionLabel:function(e){return e},renderInput:function(e){return r.a.createElement(w.a,Object.assign({},e,{label:"Course number",variant:"outlined",fullWidth:!0}))},onSelect:function(t){return e.setState({courseNumberBox:t.target.value})}}),r.a.createElement(v.a,{onClick:this.handleAddClick,style:{margin:"16px"}},"Add"))),r.a.createElement(v.a,{style:{margin:"16px"},onClick:this.handleViewScheduleClick},"View Recommended Schedules")))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(M,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},64:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},80:function(e,t,a){e.exports=a(112)},85:function(e,t,a){}},[[80,1,2]]]);
//# sourceMappingURL=main.aecb2de6.chunk.js.map