(this["webpackJsonpschedule-planner"]=this["webpackJsonpschedule-planner"]||[]).push([[0],{100:function(e,t,a){e.exports=a(130)},130:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(11),s=a.n(c),o=a(44),l=a(16),u=a.n(l),i=a(13),m=a(86),p=a(88),f=a(198),d=a(24),h=a(178),b=a(179),g=a(203),E=a(180),v=a(181),x=a(202),y=a(183),C=a(184),k=a(185),j=a(186),w=a(187),O=a(188),S=a(197),N=a(135),L=a(190),I=a(133),U=a(58),B=a(191),_=a(192),q=a(173),M=a(174),W=a(189),R=a(200),T=a(194),D=a(195),z=a(196),V=a(201),A=a(182),G=a(199),H=a(55),P=a(39),K=a.n(P),$=a(167),F=a(171),J=a(172),Y=a(175),Z=a(176),Q=a(177);var X=function(e){var t=e.courseCode,a=e.keepable,n=e.keep,c=e.onDropClick,s=e.onKeepClick;return r.a.createElement($.a,null,r.a.createElement(F.a,{primary:t}),r.a.createElement(J.a,null,r.a.createElement(R.a,{xsUp:!a},r.a.createElement(q.a,{title:n?"This course will be kept unchanged in the schedule.":"This course is allowed to be changed"},r.a.createElement("span",null,r.a.createElement(M.a,{"aria-label":"keep unchanged",disabled:!a,onClick:s},n?r.a.createElement(Y.a,null):r.a.createElement(Z.a,null))))),r.a.createElement(q.a,{title:"Drop this course"},r.a.createElement(M.a,{"aria-label":"drop",onClick:c},r.a.createElement(Q.a,null)))))},ee=a(23),te=a.n(ee),ae=function(e){return"".concat(e.subject," ").concat(e.catalog_number)},ne=function(e){return"ONLN ONLINE"===e.campus},re=function(e,t,a){var n=te.a.keyBy(e,"courseCode"),r=a.map((function(e){var a=e.filter((function(e){return!e.classes.some((function(e){return e.date.is_closed}))&&!ne(e)}));return n[ae(e[0])].keep&&(a=a.filter((function(e){return t.includes(e.class_number)}))),te.a.uniqWith(a,(function(e,t){if(e.associated_class!==t.associated_class)return!1;if(e.section.slice(0,3)!==t.section.slice(0,3))return!1;if(e.classes.length!==t.classes.length)return!1;for(var a=0;a<e.classes.length;a+=1)if(!te.a.isEqual(e.classes[a].date,t.classes[a].date))return!1;return!0}))})),c=r.map((function(e){var t=te.a.groupBy(e,(function(e){return e.section[4]})),a=[];return te.a.forEach(t,(function(e,t){a[t]=e})),a}));return{courses_info:r,filtered_courses:c.map((function(e){var t=e[0],a=e.slice(1);return t.map((function(e){var t=a.map((function(t){var a=t.filter((function(t){return a=t,e.associated_class===a.associated_class;var a}));return te.a.isEmpty(a)&&(a=t.filter((function(e){return 99===e.associated_class}))),te.a.map(a,"class_number")}));return[[e.class_number]].concat(t)}))}))}},ce=function e(t){return t.length?t[0].map((function(a){return function(e,t){return t.map((function(t){return[e].concat(t)}))}(a,e(t.slice(1)))})).flat():[[]]},se=a(50),oe="https://api.uwaterloo.ca/v2",le=function e(t){var a=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:6e3;Object(se.a)(this,e),this.sendUrlRequest=function(e){var t,n,r,c,s,l,i=arguments;return u.a.async((function(m){for(;;)switch(m.prev=m.next){case 0:return t=i.length>1&&void 0!==i[1]?i[1]:{},m.next=3,u.a.awrap(K.a.get(e,{baseURL:oe,params:Object(o.a)({},t,{key:a.apiKey}),timeout:a.timeout,timeoutErrorMessage:"timeout ".concat(a.timeout)}));case 3:if(n=m.sent,r=n.data,c=r.meta,s=r.data,200===c.status){m.next=9;break}throw(l=Error(c.message)).name="UW ".concat(c.status),l;case 9:return m.abrupt("return",s);case 10:case"end":return m.stop()}}))},this.sendBulkUrlRequest=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=K.a.create({baseURL:oe,timeout:a.timeout,timeoutErrorMessage:"timeout ".concat(a.timeout)}),r=e.map((function(e){return n.get(e,{params:Object(o.a)({},t,{key:a.apiKey})})}));return r},this.getSubjectCodes=function(){var e;return u.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.awrap(a.sendUrlRequest("/codes/subjects.json"));case 2:return e=t.sent,t.abrupt("return",e.map((function(e){return e.subject})));case 4:case"end":return t.stop()}}))},this.getCourseNumbers=function(e){var t;return u.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,u.a.awrap(a.sendUrlRequest("/courses/".concat(e,".json")));case 2:return t=n.sent,n.abrupt("return",t.map((function(e){return e.catalog_number})));case 4:case"end":return n.stop()}}))},this.getCourseSchedule=function(e,t){var n,r,c,s=arguments;return u.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return n=s.length>2&&void 0!==s[2]?s[2]:void 0,r="/courses/".concat(e,"/").concat(t,"/schedule.json"),o.next=4,u.a.awrap(a.sendUrlRequest(r,{term:n}));case 4:return c=o.sent,o.abrupt("return",c);case 6:case"end":return o.stop()}}))},this.getCourseScheduleMulti=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=e.map((function(e){var t=e.split(" "),a=Object(i.a)(t,2),n=a[0],r=a[1];return"/courses/".concat(n,"/").concat(r,"/schedule.json")}));return a.sendBulkUrlRequest(n,{term:t})},this.apiKey=t,this.timeout=n},ue=a(83),ie=a.n(ue),me=a(84),pe=a.n(me),fe=a(85),de=a.n(fe),he=a(193),be=a(87),ge=a.n(be),Ee=new le("4ad350333dc3859b91bcf443d14e4bf0"),ve=Object(m.a)((function(e){return{addCourseInput:{marginBottom:e.spacing(2)},backdrop:{zIndex:e.zIndex.drawer+1,color:"#ffffff"},currentCoursesList:{overflowY:"scroll",height:"100%"},preferenceHeader:{color:"#666666"},editCourseModal:{alignItems:"center",display:"flex",justifyContent:"center",overflow:"auto"},editCoursePaper:{outline:"none",width:750},flexContainer:{display:"flex",flexDirection:"column"},flexGrow:{flexGrow:1},fullHeight:{height:"100%"},header:{background:"#f5f5f5"},logo:{display:"block",height:"16vmin",marginTop:e.spacing(4),marginBottom:e.spacing(4),marginLeft:"auto",marginRight:"auto"},marginLeft:{marginLeft:e.spacing(2)},stepImage:{height:0,paddingTop:"100%"},stickBottom:{marginTop:"auto"},stickRight:{marginLeft:"auto"},popover:{pointerEvents:"none"},paper:{padding:e.spacing(1)}}})),xe=Object(p.a)({breakpoints:{values:{xs:0,sm:600,md:1024,lg:1440,xl:1920}},palette:{primary:{main:H.a[500],light:"#6ec6ff",dark:"#0069c0"}}});function ye(e){var t=e.label,a=e.helpMsg,c=e.leftLabel,s=e.rightLabel,o=e.sliderValue,l=e.handleSliderValueChange,u=ve(),m=Object(n.useState)(null),p=Object(i.a)(m,2),E=p[0],v=p[1],x=function(){v(null)},y=Boolean(E);return r.a.createElement(f.a,null,r.a.createElement(d.a,{component:"span",gutterBottom:!0,className:u.preferenceHeader},r.a.createElement(f.a,{display:"inline",fontWeight:"fontWeightMedium"},"".concat(t," ")),r.a.createElement(d.a,{display:"inline","aria-owns":y?"mouse-over-popover":void 0,"aria-haspopup":"true",onMouseEnter:function(e){v(e.currentTarget)},onMouseLeave:x},r.a.createElement(ge.a,{color:"action",fontSize:"small"})),r.a.createElement(h.a,{id:"mouse-over-popover",className:u.popover,classes:{paper:u.paper},open:y,anchorEl:E,anchorOrigin:{vertical:"bottom",horizontal:"left"},onClose:x,disableRestoreFocus:!0},r.a.createElement(d.a,{style:{whiteSpace:"pre"}},a))),r.a.createElement(b.a,{container:!0,spacing:1},r.a.createElement(b.a,{item:!0},r.a.createElement(d.a,{color:"textSecondary"},c)),r.a.createElement(b.a,{item:!0,xs:!0},r.a.createElement(g.a,{display:"inline",value:o,onChange:function(e,t){return l(e,t)}})),r.a.createElement(b.a,{item:!0},r.a.createElement(d.a,{color:"textSecondary"},s))))}var Ce=function(){var e=Object(n.useState)([]),t=Object(i.a)(e,2),a=t[0],c=t[1],s=Object(n.useState)([]),l=Object(i.a)(s,2),m=l[0],p=l[1],h=Object(n.useState)([]),g=Object(i.a)(h,2),H=g[0],P=g[1],$=Object(n.useState)([]),F=Object(i.a)($,2),J=F[0],Y=F[1],Z=Object(n.useState)([]),Q=Object(i.a)(Z,2),ee=Q[0],se=Q[1],oe=Object(n.useState)(!1),le=Object(i.a)(oe,2),ue=le[0],me=le[1],fe=Object(n.useState)(!1),be=Object(i.a)(fe,2),ge=be[0],Ce=be[1],ke=Object(n.useState)(!1),je=Object(i.a)(ke,2),we=je[0],Oe=je[1],Se=Object(n.useState)(""),Ne=Object(i.a)(Se,2),Le=Ne[0],Ie=Ne[1],Ue=Object(n.useState)(""),Be=Object(i.a)(Ue,2),_e=Be[0],qe=Be[1],Me=Object(n.useState)(""),We=Object(i.a)(Me,2),Re=We[0],Te=We[1],De=Object(n.useState)(""),ze=Object(i.a)(De,2),Ve=ze[0],Ae=ze[1],Ge=Object(n.useState)(""),He=Object(i.a)(Ge,2),Pe=He[0],Ke=He[1],$e=Object(n.useState)(""),Fe=Object(i.a)($e,2),Je=Fe[0],Ye=Fe[1],Ze=Object(n.useState)(!1),Qe=Object(i.a)(Ze,2),Xe=Qe[0],et=Qe[1],tt=Object(n.useState)(50),at=Object(i.a)(tt,2),nt=at[0],rt=at[1],ct=Object(n.useState)(50),st=Object(i.a)(ct,2),ot=st[0],lt=st[1],ut=Object(n.useState)(50),it=Object(i.a)(ut,2),mt=it[0],pt=it[1],ft=Object(n.useRef)(),dt=ve(),ht=function(e,t,a){Ie(e),Te(t),qe(a||""),Oe(!0)},bt=function(e,t){"clickaway"!==t&&Oe(!1)};Object(n.useEffect)((function(){!function(){var e;u.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u.a.awrap(Ee.getSubjectCodes());case 3:e=t.sent,p(e),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),ht("error","Unable to load courses.");case 10:case"end":return t.stop()}}),null,null,[[0,7]])}()}),[]);var gt=function(e,t){var a=te.a.flatten(e).map((function(e){return e.class_number}));return t.every((function(e){return a.includes(e)}))},Et=function(){ht("warning","Please make sure it's correct and try again.","Your course info cannot be read")},vt=function(e){var t=e.match(/^\d{4}$/gm),a=e.match(/[A-Z]{2,6} \d{1,3}[A-Z]? - /g).map((function(e){return e.substring(0,e.length-3)}));e.match(/^\d{3}$/gm).length===t.length&&e.match(/^0\d{2}$/gm).length===a.length?function(e,t){var a;u.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:a=Ee.getCourseScheduleMulti(e),Ce(!0),K.a.all(a).then((function(a){var n=a.map((function(e){return e.data.data}));gt(n,t)?(c(n),se(e.map((function(e){return{courseCode:e,keepable:!0,keep:!0}}))),Y(t),me(!0)):Et()})).catch((function(e){e.message.startsWith("timeout")?ht("error","Network Timeout"):ht("error",e.message)})).finally((function(){Ae(""),Ce(!1)}));case 3:case"end":return n.stop()}}))}(a,t.map((function(e){return parseInt(e,10)}))):Et()},xt=function(){me(!1),Ke(""),Ye(""),P([])},yt=function(e){try{bt(),Ae(e),function(e){try{vt(e)}catch(t){Et()}}(e)}catch(t){ht("error",t.message)}};return r.a.createElement(E.a,{theme:xe},r.a.createElement(v.a,null),r.a.createElement(x.a,{open:we,onClose:bt,anchorOrigin:{vertical:"top",horizontal:"center"},autoHideDuration:4e3},r.a.createElement(V.a,{severity:Le,onClose:bt},_e&&r.a.createElement(A.a,null,_e),Re)),r.a.createElement("img",{src:ie.a,alt:"Logo",className:dt.logo}),r.a.createElement(y.a,{maxWidth:"lg"},r.a.createElement(b.a,{container:!0,justify:"center",spacing:4},r.a.createElement(b.a,{item:!0,xs:12,sm:10,md:!0},r.a.createElement(C.a,{raised:!0},r.a.createElement(k.a,{title:"Step 1",className:dt.header}),r.a.createElement(j.a,null,r.a.createElement(d.a,{variant:"body1"},"Go to\xa0",r.a.createElement(w.a,{href:"https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/?cmd=login&languageCd=ENG",target:"_blank"},"Quest"),', click "Class Schedule".')),r.a.createElement(O.a,{image:pe.a,title:"Go to Class Schedule",className:dt.stepImage}))),r.a.createElement(b.a,{item:!0,xs:12,sm:10,md:!0},r.a.createElement(C.a,{className:"".concat(dt.flexContainer," ").concat(dt.fullHeight),raised:!0},r.a.createElement(k.a,{title:"Step 2",className:dt.header}),r.a.createElement(j.a,null,r.a.createElement(d.a,{variant:"body1"},"Select all and copy.")),r.a.createElement(O.a,{image:de.a,title:"Select All and Copy",className:"".concat(dt.stepImage," ").concat(dt.stickBottom)}))),r.a.createElement(b.a,{item:!0,xs:12,sm:10,md:!0},r.a.createElement(C.a,{className:"".concat(dt.flexContainer," ").concat(dt.fullHeight),raised:!0},r.a.createElement(k.a,{title:"Step 3",className:dt.header}),r.a.createElement(j.a,{className:"".concat(dt.flexContainer," ").concat(dt.flexGrow)},r.a.createElement(f.a,{mb:2},r.a.createElement(d.a,{variant:"body1"},"Paste into the box below.")),r.a.createElement(S.a,{className:dt.flexGrow,value:Ve,onPaste:function(e){return yt(e.clipboardData.getData("text/plain"))},multiline:!0,required:!0,variant:"outlined",fullWidth:!0,rows:12,InputProps:{className:dt.fullHeight},inputProps:{className:dt.fullHeight}})))))),r.a.createElement(N.a,{open:ue,onClose:xt,className:dt.editCourseModal,BackdropComponent:L.a,BackdropProps:{timeout:500},closeAfterTransition:!0,disableBackdropClick:!0},r.a.createElement(I.a,{in:ue},r.a.createElement(U.a,{className:dt.editCoursePaper},r.a.createElement(B.a,{position:"static",color:"default",elevation:0},r.a.createElement(_.a,null,r.a.createElement(d.a,{variant:"h6",className:dt.flexGrow},"Edit my courses"),r.a.createElement(q.a,{title:"Close"},r.a.createElement(M.a,{"aria-label":"close",onClick:xt},r.a.createElement(he.a,null))))),r.a.createElement(b.a,{container:!0},r.a.createElement(b.a,{item:!0,xs:12,sm:!0},r.a.createElement(W.a,{className:dt.currentCoursesList},ee.map((function(e){var t=e.courseCode,n=e.keepable,s=e.keep;return r.a.createElement(X,{key:t,courseCode:t,keepable:n,keep:s,onDropClick:function(){return function(e){var t=ee.filter((function(t){return t.courseCode!==e})),n=a.filter((function(t){return ae(t[0])!==e}));se(t),c(n)}(t)},onKeepClick:function(){return function(e){var t=ee.map((function(t){return t.courseCode===e?Object(o.a)({},t,{keep:!t.keep}):t}));se(t)}(t)}})}))),r.a.createElement(R.a,{smUp:!0},r.a.createElement(T.a,null))),r.a.createElement(b.a,{item:!0,xs:12,sm:!0},r.a.createElement(f.a,{p:2,display:"flex",flexDirection:"column"},r.a.createElement(G.a,{className:dt.addCourseInput,id:"subjectBox",options:m,renderInput:function(e){return r.a.createElement(S.a,Object.assign({},e,{label:"Subject",variant:"outlined",fullWidth:!0}))},onChange:function(e,t){t!==Pe&&(!function(e){var t;u.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:if(e){a.next=3;break}return P([]),a.abrupt("return");case 3:return a.prev=3,a.next=6,u.a.awrap(Ee.getCourseNumbers(e));case 6:t=a.sent,P(t),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(3),P([]);case 13:case"end":return a.stop()}}),null,null,[[3,10]])}(t),Ke((t||"").toUpperCase()),Ye(""),t&&ft.current.focus())},value:Pe}),r.a.createElement(G.a,{className:dt.addCourseInput,id:"courseNumberBox",options:H,getOptionLabel:function(e){return e},renderInput:function(e){return r.a.createElement(S.a,Object.assign({},e,{label:"Course number",variant:"outlined",fullWidth:!0,inputRef:ft}))},onChange:function(e,t){Ye(t)},value:Je}),r.a.createElement(f.a,{mx:0,display:"flex",alignItems:"center",justifyContent:"flex-end"},Xe&&r.a.createElement(D.a,{size:36/Math.sqrt(2)}),r.a.createElement(z.a,{color:"primary",variant:"outlined",onClick:function(){var e,t,n,r,s;return u.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:if(Pe&&Je){o.next=2;break}return o.abrupt("return");case 2:if(et(!0),e="".concat(Pe," ").concat(Je),!(t=ee.slice()).some((function(t){return e===t.courseCode}))){o.next=9;break}return ht("info","".concat(e," is already in your schedule.")),et(!1),o.abrupt("return");case 9:return o.prev=9,o.next=12,u.a.awrap(Ee.getCourseSchedule(Pe,Je));case 12:if(!(n=o.sent).every(ne)){o.next=17;break}throw(r=new Error("".concat(e," is only available online."))).name="UW online",r;case 17:t.push({courseCode:e,keepable:!1,keep:!1}),(s=a.slice()).push(n),se(t),c(s),o.next=27;break;case 24:o.prev=24,o.t0=o.catch(9),"UW 204"===o.t0.name?ht("warning","".concat(e," is unavailable for this term.")):"UW online"===o.t0.name?ht("warning",o.t0.message):o.t0.message.startsWith("timeout")?ht("error","Network Timeout"):ht("error",o.t0.message);case 27:return o.prev=27,et(!1),o.finish(27);case 30:case"end":return o.stop()}}),null,null,[[9,24,27,30]])},className:dt.marginLeft,disabled:Xe},"Add Course")),r.a.createElement(f.a,{paddingTop:2,px:1},r.a.createElement(ye,{label:"First Class",helpMsg:"whether you prefer to start your day early",leftLabel:"Early",rightLabel:"Late",sliderValue:nt,handleSliderValueChange:function(e,t){return rt(t)}}),r.a.createElement(ye,{label:"Even Distribution",helpMsg:"whether you prefer to have approximately same number of classes everyday",leftLabel:"Even",rightLabel:"Uneven",sliderValue:ot,handleSliderValueChange:function(e,t){return lt(t)}}),r.a.createElement(ye,{label:"Cluster Classes",helpMsg:"whether you prefer to have your classes back to back or separately",leftLabel:"Together",rightLabel:"Separate",sliderValue:mt,handleSliderValueChange:function(e,t){return pt(t)}}))))),r.a.createElement(T.a,null),r.a.createElement(f.a,{p:2},r.a.createElement(z.a,{size:"large",variant:"contained",color:"primary",fullWidth:!0,onClick:function(){var e,t;return u.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(e=re(ee,J,a),!((r=e.filtered_courses,ce(r.map((function(e){return e.map((function(e){return ce(e)})).flat()}))).map((function(e){return e.flat()}))).length>2e5)){n.next=4;break}return ht("warning","Try locking some of your courses or reduce the number of courses.","Too many course combinations"),n.abrupt("return");case 4:return e.preferences=[nt,ot,mt],"https://qemn8c6rx9.execute-api.us-east-2.amazonaws.com/test/handleschedulerequest",n.prev=6,n.next=9,u.a.awrap(K.a.post("https://qemn8c6rx9.execute-api.us-east-2.amazonaws.com/test/handleschedulerequest",e,{timeout:15e3}));case 9:t=n.sent,console.log(t),n.next=16;break;case 13:n.prev=13,n.t0=n.catch(6),n.t0.message.startsWith("timeout")?ht("error","Network Timeout"):ht("error",n.t0.message);case 16:case"end":return n.stop()}var r}),null,null,[[6,13]])},disabled:Xe},"View Recommended Schedules"))))),r.a.createElement(L.a,{className:dt.backdrop,open:ge},r.a.createElement(D.a,{color:"inherit"})))};s.a.render(r.a.createElement(Ce,null),document.getElementById("root"))},83:function(e,t,a){e.exports=a.p+"static/media/icon.47f3ae83.svg"},84:function(e,t,a){e.exports=a.p+"static/media/calendar-step-1.5a0cc442.png"},85:function(e,t,a){e.exports=a.p+"static/media/calendar-step-2.514203ac.png"}},[[100,1,2]]]);
//# sourceMappingURL=main.32f5c81a.chunk.js.map