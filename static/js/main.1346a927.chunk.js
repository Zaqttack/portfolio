(this["webpackJsonpopen-react-template"]=this["webpackJsonpopen-react-template"]||[]).push([[0],{23:function(e,t,a){e.exports=a(44)},33:function(e,t,a){e.exports=a.p+"static/media/z-logo.4359350e.svg"},34:function(e,t,a){e.exports=a.p+"static/media/video-placeholder.8a9d1399.png"},35:function(e,t,a){e.exports=a.p+"static/media/feature-tile-icon-01.a520cf52.svg"},36:function(e,t,a){e.exports=a.p+"static/media/feature-tile-icon-03.198608f5.svg"},37:function(e,t,a){e.exports=a.p+"static/media/feature-tile-icon-02.5111bcd5.svg"},38:function(e,t,a){e.exports=a.p+"static/media/feature-tile-icon-04.dc69dedd.svg"},39:function(e,t,a){e.exports=a.p+"static/media/feature-tile-icon-06.af818383.svg"},40:function(e,t,a){e.exports=a.p+"static/media/feature-acm-wiki.b7a9d36a.png"},41:function(e,t,a){e.exports=a.p+"static/media/feature-rowdyhacks.2e478bc1.png"},42:function(e,t,a){e.exports=a.p+"static/media/feature-roadrunner-cycling.975539bb.jpg"},43:function(e,t,a){},44:function(e,t,a){"use strict";a.r(t);var i=a(0),n=a.n(i),l=a(20),r=a.n(l),s=a(12),o=a(7),c=a(5),m=a(2),d=["component","layout"],u=function(e){var t=e.component,a=e.layout,i=Object(m.a)(e,d);return a=void 0===a?function(e){return n.a.createElement(n.a.Fragment,null,e.children)}:a,n.a.createElement(c.a,Object.assign({},i,{render:function(e){return n.a.createElement(a,null,n.a.createElement(t,e))}}))},v=a(10),h=a(3),p=a.n(h),f=a(16),b=n.a.forwardRef((function(e,t){var a=Object(i.useState)(window.innerHeight),l=Object(v.a)(a,2),r=l[0],s=l[1],o=Object(i.useState)([]),c=Object(v.a)(o,2),m=c[0],d=c[1],u=function(){return m.length<=document.querySelectorAll("[class*=reveal-].is-revealed").length},h=function(){if(!u())for(var e=function(e){var t=m[e],a=t.getAttribute("data-reveal-delay"),i=t.getAttribute("data-reveal-offset")?t.getAttribute("data-reveal-offset"):"200";(function(e,t){return e.getBoundingClientRect().top<=r-t})(t.getAttribute("data-reveal-container")?t.closest(t.getAttribute("data-reveal-container")):t,i)&&!t.classList.contains("is-revealed")&&(a&&0!==a?setTimeout((function(){t.classList.add("is-revealed")}),a):t.classList.add("is-revealed"))},t=0;t<m.length;t++)e(t)};Object(i.useImperativeHandle)(t,(function(){return{init:function(){d(document.querySelectorAll("[class*=reveal-]"))}}})),Object(i.useEffect)((function(){"undefined"!==typeof m&&m.length>0&&(u()||(window.addEventListener("scroll",b),window.addEventListener("resize",E)),h())}),[m]);var p=function(){u()&&(window.removeEventListener("scroll",b),window.removeEventListener("resize",E))},b=Object(f.throttle)((function(){p(),h()}),30),E=Object(f.throttle)((function(){s(window.innerHeight)}),30);return Object(i.useEffect)((function(){p(),h()}),[r]),n.a.createElement(n.a.Fragment,null,e.children())}));b.propTypes={children:p.a.func.isRequired};var E=b,g=a(13),N=a(1),w=a.n(N),y=["className","src","width","height","alt"],O=function(e){var t=e.className,a=e.src,l=e.width,r=e.height,s=e.alt,o=Object(m.a)(e,y),c=Object(i.useState)(!1),d=Object(v.a)(c,2),u=d[0],h=d[1],p=Object(i.useRef)(null);Object(i.useEffect)((function(){f(p.current)}),[]);var f=function(e){var t,a,i=document.createElement("img");u||(e.style.display="none",e.before(i),i.src=(t=e.getAttribute("width")||0,a=e.getAttribute("height")||0,'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(t," ").concat(a,'"%3E%3C/svg%3E')),i.width=e.getAttribute("width"),i.height=e.getAttribute("height"),i.style.opacity="0",e.className&&i.classList.add(e.className),i.remove(),e.style.display="")};return n.a.createElement("img",Object.assign({},o,{ref:p,className:t,src:a,width:l,height:r,alt:s,onLoad:function(){h(!0)}}))};O.defaultProps={src:void 0,width:void 0,height:void 0,alt:void 0};var k=O,j=["className"],x=function(e){var t=e.className,i=Object(m.a)(e,j),l=w()("brand",t);return n.a.createElement("div",Object.assign({},i,{className:l}),n.a.createElement("h1",{className:"m-0"},n.a.createElement(k,{src:a(33),alt:"Open",width:32,height:32})))},D=["className","navPosition","hideNav","hideSignin","bottomOuterDivider","bottomDivider"],C=function(e){var t=e.className,a=e.navPosition,l=e.hideNav,r=e.hideSignin,s=e.bottomOuterDivider,o=e.bottomDivider,c=Object(m.a)(e,D),d=Object(i.useState)(!1),u=Object(v.a)(d,2),h=u[0],p=u[1],f=Object(i.useRef)(null),b=Object(i.useRef)(null);Object(i.useEffect)((function(){return h&&E(),document.addEventListener("keydown",N),document.addEventListener("click",y),function(){document.removeEventListener("keydown",N),document.removeEventListener("click",y),g()}}));var E=function(){document.body.classList.add("off-nav-is-active"),f.current.style.maxHeight=f.current.scrollHeight+"px",p(!0)},g=function(){document.body.classList.remove("off-nav-is-active"),f.current&&(f.current.style.maxHeight=null),p(!1)},N=function(e){h&&27===e.keyCode&&g()},y=function(e){f.current&&h&&!f.current.contains(e.target)&&e.target!==b.current&&g()},O=w()("site-header",s&&"has-bottom-divider",t);return n.a.createElement("header",Object.assign({},c,{className:O}),n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:w()("site-header-inner",o&&"has-bottom-divider")},n.a.createElement(x,null),!l&&n.a.createElement(n.a.Fragment,null,n.a.createElement("button",{ref:b,className:"header-nav-toggle",onClick:h?g:E},n.a.createElement("span",{className:"screen-reader"},"Menu"),n.a.createElement("span",{className:"hamburger"},n.a.createElement("span",{className:"hamburger-inner"}))),n.a.createElement("nav",{ref:f,className:w()("header-nav",h&&"is-active")},n.a.createElement("div",{className:"header-nav-inner"},n.a.createElement("ul",{className:w()("list-reset text-xs",a&&"header-nav-".concat(a))}),!r&&n.a.createElement("ul",{className:"list-reset header-nav-right"})))))))};C.defaultProps={navPosition:"",hideNav:!1,hideSignin:!1,bottomOuterDivider:!1,bottomDivider:!1};var L=C,I=["className"],A=function(e){var t=e.className,a=Object(m.a)(e,I),i=w()("footer-nav",t);return n.a.createElement("nav",Object.assign({},a,{className:i}),n.a.createElement("ul",{className:"list-reset"},n.a.createElement("li",null,n.a.createElement("a",{href:"https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view?usp=sharing"},"Resume")),n.a.createElement("li",null,n.a.createElement("a",{href:"https://github.com/Zaqttack"},"GitHub")),n.a.createElement("li",null,n.a.createElement("a",{href:"https://www.linkedin.com/in/zaquariah-holland/"},"LinkdIn")),n.a.createElement("li",null,n.a.createElement("a",{href:"https://www.instagram.com/president.zaquariah/"},"Instagram")),n.a.createElement("li",null,n.a.createElement("a",{href:"mailto:zaquariah@gmail.com"},"Contact"))))},P=["className"],T=function(e){var t=e.className,a=Object(m.a)(e,P),i=w()("footer-social",t);return n.a.createElement("div",Object.assign({},a,{className:i}),n.a.createElement("ul",{className:"list-reset"}))},H=["className","topOuterDivider","topDivider"],F=function(e){var t=e.className,a=e.topOuterDivider,i=e.topDivider,l=Object(m.a)(e,H),r=w()("site-footer center-content-mobile",a&&"has-top-divider",t);return n.a.createElement("footer",Object.assign({},l,{className:r}),n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:w()("site-footer-inner",i&&"has-top-divider")},n.a.createElement("div",{className:"footer-top space-between text-xxs"},n.a.createElement(x,null),n.a.createElement(T,null)),n.a.createElement("div",{className:"footer-bottom space-between text-xxs invert-order-desktop"},n.a.createElement(A,null),n.a.createElement("div",{className:"footer-copyright"},"Made by ",n.a.createElement("a",{href:"https://www.youtube.com/watch?v=KQLPL1qRhn8"},"Zaquariah"),". All right are not reserved")))))};F.defaultProps={topOuterDivider:!1,topDivider:!1};var S=F,q=function(e){var t=e.children;return n.a.createElement(n.a.Fragment,null,n.a.createElement(L,{navPosition:"right",className:"reveal-from-bottom"}),n.a.createElement("main",{className:"site-content"},t),n.a.createElement(S,null))},B=a(4),R={types:{topOuterDivider:p.a.bool,bottomOuterDivider:p.a.bool,topDivider:p.a.bool,bottomDivider:p.a.bool,hasBgColor:p.a.bool,invertColor:p.a.bool},defaults:{topOuterDivider:!1,bottomOuterDivider:!1,topDivider:!1,bottomDivider:!1,hasBgColor:!1,invertColor:!1}},z={types:Object(B.a)({},R.types),defaults:Object(B.a)({},R.defaults)},M={types:Object(B.a)(Object(B.a)({},R.types),{},{invertMobile:p.a.bool,invertDesktop:p.a.bool,alignTop:p.a.bool,imageFill:p.a.bool}),defaults:Object(B.a)(Object(B.a)({},R.defaults),{},{invertMobile:!1,invertDesktop:!1,alignTop:!1,imageFill:!1})},W={types:Object(B.a)(Object(B.a)({},R.types),{},{pushLeft:p.a.bool}),defaults:Object(B.a)(Object(B.a)({},R.defaults),{},{pushLeft:!1})},Z=["className"],_=function(e){var t=e.className,a=Object(m.a)(e,Z),i=w()("button-group",t);return n.a.createElement("div",Object.assign({},a,{className:i}))},G=["className","tag","color","size","loading","wide","wideMobile","disabled"],K=function(e){var t=e.className,a=e.tag,i=e.color,l=e.size,r=e.loading,s=e.wide,o=e.wideMobile,c=e.disabled,d=Object(m.a)(e,G),u=w()("button",i&&"button-".concat(i),l&&"button-".concat(l),r&&"is-loading",s&&"button-block",o&&"button-wide-mobile",t),v=a;return n.a.createElement(v,Object.assign({},d,{className:u,disabled:c}))};K.defaultProps={tag:"button",color:"",size:"",loading:!1,wide:!1,wideMobile:!1,disabled:!1};var U=["className","children","handleClose","show","closeHidden","video","videoTag"],Q=function(e){var t=e.className,a=e.children,l=e.handleClose,r=e.show,s=e.closeHidden,o=e.video,c=e.videoTag,d=Object(m.a)(e,U);Object(i.useEffect)((function(){return document.addEventListener("keydown",v),document.addEventListener("click",h),function(){document.removeEventListener("keydown",v),document.removeEventListener("click",h)}})),Object(i.useEffect)((function(){u()}),[d.show]);var u=function(){document.querySelectorAll(".modal.is-active").length?document.body.classList.add("modal-is-active"):document.body.classList.remove("modal-is-active")},v=function(e){27===e.keyCode&&l(e)},h=function(e){e.stopPropagation()},p=w()("modal",r&&"is-active",o&&"modal-video",t);return n.a.createElement(n.a.Fragment,null,r&&n.a.createElement("div",Object.assign({},d,{className:p,onClick:l}),n.a.createElement("div",{className:"modal-inner",onClick:h},o?n.a.createElement("div",{className:"responsive-video"},"iframe"===c?n.a.createElement("iframe",{title:"video",src:o,frameBorder:"0",allowFullScreen:!0}):n.a.createElement("video",{"v-else":!0,controls:!0,src:o})):n.a.createElement(n.a.Fragment,null,!s&&n.a.createElement("button",{className:"modal-close","aria-label":"close",onClick:l}),n.a.createElement("div",{className:"modal-content"},a)))))};Q.defaultProps={children:null,show:!1,closeHidden:!1,video:"",videoTag:"iframe"};var V=Q,J=["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor"],X=Object(B.a)({},z.defaults),$=function(e){var t=e.className,l=e.topOuterDivider,r=e.bottomOuterDivider,s=e.topDivider,o=e.bottomDivider,c=e.hasBgColor,d=e.invertColor,u=Object(m.a)(e,J),h=Object(i.useState)(!1),p=Object(v.a)(h,2),f=p[0],b=p[1],E=w()("hero section center-content",l&&"has-top-divider",r&&"has-bottom-divider",c&&"has-bg-color",d&&"invert-color",t),g=w()("hero-inner section-inner",s&&"has-top-divider",o&&"has-bottom-divider");return n.a.createElement("section",Object.assign({},u,{className:E}),n.a.createElement("div",{className:"container-sm"},n.a.createElement("div",{className:g},n.a.createElement("div",{className:"hero-content"},n.a.createElement("h1",{className:"mt-0 mb-16 reveal-from-bottom","data-reveal-delay":"200"},"Holland, ",n.a.createElement("span",{className:"text-color-primary"},"Zaquariah")),n.a.createElement("div",{className:"container-xs"},n.a.createElement("p",{className:"m-0 mb-32 reveal-from-bottom","data-reveal-delay":"400"},"The great Technical Officer of ACM from 20-21 brings you a new change of pace! A chance for him to lead."),n.a.createElement("p",{className:"m-0 mb-32 reveal-from-bottom","data-reveal-delay":"500"},"Let me be your next ",n.a.createElement("span",{className:"text-color-primary"},"ACM President"),"."),n.a.createElement("div",{className:"reveal-from-bottom","data-reveal-delay":"600"},n.a.createElement(_,null)))),n.a.createElement("div",{className:"hero-figure reveal-from-bottom illustration-element-01","data-reveal-value":"20px","data-reveal-delay":"800"},n.a.createElement("a",{"data-video":"https://player.vimeo.com/video/495209065",href:"#0","aria-controls":"video-modal",onClick:function(e){e.preventDefault(),b(!0)}},n.a.createElement(k,{className:"has-shadow",src:a(34),alt:"Hero",width:896,height:504}))),n.a.createElement(V,{id:"video-modal",show:f,handleClose:function(e){e.preventDefault(),b(!1)},video:"https://player.vimeo.com/video/495209065",videoTag:"iframe"}))))};$.defaultProps=X;var Y=$,ee=["className","data","children","tag"],te=function(e){var t=e.className,a=e.data,i=e.children,l=e.tag,r=Object(m.a)(e,ee),s=w()("section-header",t),o=l;return n.a.createElement(n.a.Fragment,null,(a.title||a.paragraph)&&n.a.createElement("div",Object.assign({},r,{className:s}),n.a.createElement("div",{className:"container-xs"},i,a.title&&n.a.createElement(o,{className:w()("mt-0",a.paragraph?"mb-16":"mb-0")},a.title),a.paragraph&&n.a.createElement("p",{className:"m-0"},a.paragraph))))};te.defaultProps={children:null,tag:"h2"};var ae=te,ie=["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","pushLeft"],ne=Object(B.a)({},W.defaults),le=function(e){var t=e.className,i=e.topOuterDivider,l=e.bottomOuterDivider,r=e.topDivider,s=e.bottomDivider,o=e.hasBgColor,c=e.invertColor,d=e.pushLeft,u=Object(m.a)(e,ie),v=w()("features-tiles section",i&&"has-top-divider",l&&"has-bottom-divider",o&&"has-bg-color",c&&"invert-color",t),h=w()("features-tiles-inner section-inner pt-0",r&&"has-top-divider",s&&"has-bottom-divider"),p=w()("tiles-wrap center-content",d&&"push-left");return n.a.createElement("section",Object.assign({},u,{className:v}),n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:h},n.a.createElement(ae,{data:{title:"Know my background",paragraph:"Take a peek into the leadership that I can offer. These skills all came with the support of my team and with them, I will help lead!"},className:"center-content"}),n.a.createElement("div",{className:p},n.a.createElement("div",{className:"tiles-item reveal-from-bottom"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"features-tiles-item-header"},n.a.createElement("div",{className:"features-tiles-item-image mb-16"},n.a.createElement(k,{src:a(35),alt:"Features tile icon 01",width:64,height:64}))),n.a.createElement("div",{className:"features-tiles-item-content"},n.a.createElement("h4",{className:"mt-0 mb-8"},"Leadership"),n.a.createElement("p",{className:"m-0 text-sm"},"Whether it is a group project in class or creating a Wiki for the largest CS club on campus, you can always rely on me to get the ball rolling!")))),n.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"200"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"features-tiles-item-header"},n.a.createElement("div",{className:"features-tiles-item-image mb-16"},n.a.createElement(k,{src:a(36),alt:"Features tile icon 02",width:64,height:64}))),n.a.createElement("div",{className:"features-tiles-item-content"},n.a.createElement("h4",{className:"mt-0 mb-8"},"Teamwork"),n.a.createElement("p",{className:"m-0 text-sm"},"Effectively and efficiently setting and completing task is my status quo.")))),n.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"400"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"features-tiles-item-header"},n.a.createElement("div",{className:"features-tiles-item-image mb-16"},n.a.createElement(k,{src:a(37),alt:"Features tile icon 03",width:64,height:64}))),n.a.createElement("div",{className:"features-tiles-item-content"},n.a.createElement("h4",{className:"mt-0 mb-8"},"Coding Skills"),n.a.createElement("p",{className:"m-0 text-sm"},"Although I am still growing, this is my future and it is what I am passionate about now.")))),n.a.createElement("div",{className:"tiles-item reveal-from-bottom"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"features-tiles-item-header"},n.a.createElement("div",{className:"features-tiles-item-image mb-16"},n.a.createElement(k,{src:a(38),alt:"Features tile icon 04",width:64,height:64}))),n.a.createElement("div",{className:"features-tiles-item-content"},n.a.createElement("h4",{className:"mt-0 mb-8"},"Self Learner"),n.a.createElement("p",{className:"m-0 text-sm"},"I would not be here now if it was not for need to be constantly acquiring new skills to help myself and my friends succeed.")))),n.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"200"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"features-tiles-item-header"},n.a.createElement("div",{className:"features-tiles-item-image mb-16"},n.a.createElement(k,{src:a(39),alt:"Features tile icon 06",width:64,height:64}))),n.a.createElement("div",{className:"features-tiles-item-content"},n.a.createElement("h4",{className:"mt-0 mb-8"},"Dependable"),n.a.createElement("p",{className:"m-0 text-sm"},"Always around when a task needs to be completed and will ensure that time can be set aside for just about any problem."))))))))};le.defaultProps=ne;var re=le,se=["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","invertMobile","invertDesktop","alignTop","imageFill"],oe=Object(B.a)({},M.defaults),ce=function(e){var t=e.className,i=e.topOuterDivider,l=e.bottomOuterDivider,r=e.topDivider,s=e.bottomDivider,o=e.hasBgColor,c=e.invertColor,d=e.invertMobile,u=e.invertDesktop,v=e.alignTop,h=e.imageFill,p=Object(m.a)(e,se),f=w()("features-split section",i&&"has-top-divider",l&&"has-bottom-divider",o&&"has-bg-color",c&&"invert-color",t),b=w()("features-split-inner section-inner",r&&"has-top-divider",s&&"has-bottom-divider"),E=w()("split-wrap",d&&"invert-mobile",u&&"invert-desktop",v&&"align-top");return n.a.createElement("section",Object.assign({},p,{className:f}),n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:b},n.a.createElement(ae,{data:{title:"Projects and Leadership",paragraph:"Gaze upon highlights I have enjoyed throughout my journey in leadership. The very moments that have helped define and shape who I am."},className:"center-content"}),n.a.createElement("div",{className:E},n.a.createElement("div",{className:"split-item"},n.a.createElement("div",{className:"split-item-content center-content-mobile reveal-from-left","data-reveal-container":".split-item"},n.a.createElement("div",{className:"text-xxs text-color-primary fw-600 tt-u mb-8"},n.a.createElement("a",{href:"https://wiki.acmutsa.org"},"officer")," // acm utsa"),n.a.createElement("h3",{className:"mt-0 mb-12"},"ACM Wiki"),n.a.createElement("p",{className:"m-0"},"I saw a gap in our organization for archiving and documenting historical data. We needed a place that future teams could look back on and easily find solutions. Thus aiding in further developing any future endeavours.")),n.a.createElement("div",{className:w()("split-item-image center-content-mobile reveal-from-bottom",h&&"split-item-image-fill"),"data-reveal-container":".split-item"},n.a.createElement(k,{src:a(40),alt:"Features split 01",width:528,height:396}))),n.a.createElement("div",{className:"split-item"},n.a.createElement("div",{className:"split-item-content center-content-mobile reveal-from-right","data-reveal-container":".split-item"},n.a.createElement("div",{className:"text-xxs text-color-primary fw-600 tt-u mb-8"},n.a.createElement("a",{href:"https://rowdyhacks.org"},"Web Dev")," // rowdyhacks"),n.a.createElement("h3",{className:"mt-0 mb-12"},"RowdyHacks Website"),n.a.createElement("p",{className:"m-0"},"Taking over the reigns from RowdyHacks 2020 was no joke but Brent, Chris and I are making it happen. The site has gone through a slight revamp to get updated with a fresh coat of paint. Hopefully showing off everything (and everyone) that RowdyHacks has to offer!")),n.a.createElement("div",{className:w()("split-item-image center-content-mobile reveal-from-bottom",h&&"split-item-image-fill"),"data-reveal-container":".split-item"},n.a.createElement(k,{src:a(41),alt:"Features split 02",width:528,height:396}))),n.a.createElement("div",{className:"split-item"},n.a.createElement("div",{className:"split-item-content center-content-mobile reveal-from-left","data-reveal-container":".split-item"},n.a.createElement("div",{className:"text-xxs text-color-primary fw-600 tt-u mb-8"},n.a.createElement("a",{href:"https://rrcycling.org"},"Vice Pres")," // roadrunner cycling"),n.a.createElement("h3",{className:"mt-0 mb-12"},"Roadrunner Cycling"),n.a.createElement("p",{className:"m-0"},"If you have ever followed the team of Roadrunner Cycling, you will know that this club has had many ups and downs But with Ethan Flores, myself and our team we have been able to rebuild this club from the ground up. Not only are we pulling in sponsors but we are helping build a better community of cyclist on UTSA campus.")),n.a.createElement("div",{className:w()("split-item-image center-content-mobile reveal-from-bottom",h&&"split-item-image-fill"),"data-reveal-container":".split-item"},n.a.createElement(k,{src:a(42),alt:"Features split 03",width:528,height:396})))))))};ce.defaultProps=oe;var me=ce,de=["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","pushLeft"],ue=Object(B.a)({},W.defaults),ve=function(e){var t=e.className,a=e.topOuterDivider,i=e.bottomOuterDivider,l=e.topDivider,r=e.bottomDivider,s=e.hasBgColor,o=e.invertColor,c=e.pushLeft,d=Object(m.a)(e,de),u=w()("testimonial section",a&&"has-top-divider",i&&"has-bottom-divider",s&&"has-bg-color",o&&"invert-color",t),v=w()("testimonial-inner section-inner",l&&"has-top-divider",r&&"has-bottom-divider"),h=w()("tiles-wrap",c&&"push-left");return n.a.createElement("section",Object.assign({},d,{className:u}),n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:v},n.a.createElement(ae,{data:{title:"Friends and Coworkers",paragraph:"Not impressed yet? Well, don't just take my word for it, see what people have to say about me!"},className:"center-content"}),n.a.createElement("div",{className:h},n.a.createElement("div",{className:"tiles-item reveal-from-right","data-reveal-delay":"200"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"testimonial-item-content"},n.a.createElement("p",{className:"text-sm mb-0"},"\u2014 Zaquariah is one of the highest energy individuals I know ... sometime too much energy ... no like seriously, sometime I need to tell him to calm down.")),n.a.createElement("div",{className:"testimonial-item-footer text-xs mt-32 mb-0 has-top-divider"},n.a.createElement("span",{className:"testimonial-item-name text-color-high"},"Quintin Heard"),n.a.createElement("span",{className:"text-color-low"}," / "),n.a.createElement("span",{className:"testimonial-item-link"},n.a.createElement("a",{href:"https://www.linkedin.com/in/quintin-heard-896374164/"},"LinkdIn"))))),n.a.createElement("div",{className:"tiles-item reveal-from-bottom"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"testimonial-item-content"},n.a.createElement("p",{className:"text-sm mb-0"},"\u2014 In the almost four years I have known Zaq, he has been a consistent hard worker. Always going the extra mile to achieve success. He thinks outside the box and comes up with new innovative ways to achieve group sucess and accomplish goals. He is very driven and always wanting to do better. He brings a fun humorous attitude to even stressful and difficult environments.")),n.a.createElement("div",{className:"testimonial-item-footer text-xs mt-32 mb-0 has-top-divider"},n.a.createElement("span",{className:"testimonial-item-name text-color-high"},"Ross Schanck"),n.a.createElement("span",{className:"text-color-low"}," / "),n.a.createElement("span",{className:"testimonial-item-link"},n.a.createElement("a",{href:"https://www.linkedin.com/in/intel-schanck/"},"LinkdIn"))))),n.a.createElement("div",{className:"tiles-item reveal-from-left","data-reveal-delay":"200"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"testimonial-item-content"},n.a.createElement("p",{className:"text-sm mb-0"},"\u2014 Ever since he was young, Zaquariah has always worked hard for what he wanted and done it on his time table. From learning how to walk to getting his education. This newest adventure is something I know he'll not only succeed at but he will excel! And I'm not just saying that because I'm his mom.")),n.a.createElement("div",{className:"testimonial-item-footer text-xs mt-32 mb-0 has-top-divider"},n.a.createElement("span",{className:"testimonial-item-name text-color-high"},"Zaq's Mom"),n.a.createElement("span",{className:"text-color-low"}," / "),n.a.createElement("span",{className:"testimonial-item-link"},n.a.createElement("a",{href:"https://www.linkedin.com/in/anastasia-oestreich-94b2091a1/"},"LinkdIn"))))),n.a.createElement("div",{className:"tiles-item reveal-from-right","data-reveal-delay":"200"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"testimonial-item-content"},n.a.createElement("p",{className:"text-sm mb-0"},"\u2014 ACM is full of great people but I've found myself getting closest to Zaq. He's really chill, friendly and helpful. Anyone in ACM would agree that he's a great contribution to the team, and would make as an amazing President. Anyone would be lucky to have him as a friend! Zaq = G.O.A.T.")),n.a.createElement("div",{className:"testimonial-item-footer text-xs mt-32 mb-0 has-top-divider"},n.a.createElement("span",{className:"testimonial-item-name text-color-high"},"Desiree Garcia"),n.a.createElement("span",{className:"text-color-low"}," / "),n.a.createElement("span",{className:"testimonial-item-link"},n.a.createElement("a",{href:"https://www.linkedin.com/in/desiree-garcia-/"},"LinkdIn"))))),n.a.createElement("div",{className:"tiles-item reveal-from-left","data-reveal-delay":"200"},n.a.createElement("div",{className:"tiles-item-inner"},n.a.createElement("div",{className:"testimonial-item-content"},n.a.createElement("p",{className:"text-sm mb-0"},"\u2014 In the time I have known Zaq I have learned that he is a driven individual. Always setting goals to accomplish and working as hard as he can to follow through. Zaq is very innovative as well always coming up with ideas and solutions to problems. The part that I like the best about Zaq though is that he always brings cheer to his work, always making the best of a difficult situation.")),n.a.createElement("div",{className:"testimonial-item-footer text-xs mt-32 mb-0 has-top-divider"},n.a.createElement("span",{className:"testimonial-item-name text-color-high"},"William Swinny"),n.a.createElement("span",{className:"text-color-low"}," / "),n.a.createElement("span",{className:"testimonial-item-link"},n.a.createElement("a",{href:"https://www.linkedin.com/in/williamswinny/"},"LinkdIn")))))))))};ve.defaultProps=ue;var he=ve,pe=["className","children","labelHidden","id"],fe=function(e){var t=e.className,a=e.children,i=e.labelHidden,l=e.id,r=Object(m.a)(e,pe),s=w()("form-label",i&&"screen-reader",t);return n.a.createElement("label",Object.assign({},r,{className:s,htmlFor:l}),a)};fe.defaultProps={children:null,labelHidden:!1,id:null};var be=fe,Ee=["children","className","status"],ge=function(e){var t=e.children,a=e.className,i=e.status,l=Object(m.a)(e,Ee),r=w()("form-hint",i&&"text-color-".concat(i),a);return n.a.createElement("div",Object.assign({},l,{className:r}),t)};ge.defaultProps={children:null,status:!1};var Ne=ge,we=["className","children","label","labelHidden","type","name","status","disabled","value","formGroup","hasIcon","size","placeholder","rows","hint"],ye=function(e){var t=e.className,a=e.children,i=e.label,l=e.labelHidden,r=e.type,s=e.name,o=e.status,c=e.disabled,d=e.value,u=e.formGroup,v=e.hasIcon,h=e.size,p=e.placeholder,f=e.rows,b=e.hint,E=Object(m.a)(e,we),g=w()(u&&""!==u&&("desktop"===u?"form-group-desktop":"form-group"),v&&""!==v&&"has-icon-"+v),N=w()("form-input",h&&"form-input-".concat(h),o&&"form-".concat(o),t),y="textarea"===r?"textarea":"input";return n.a.createElement(n.a.Fragment,null,i&&n.a.createElement(be,{labelHidden:l,id:E.id},i),n.a.createElement("div",{className:g},n.a.createElement(y,Object.assign({},E,{type:"textarea"!==r?r:null,className:N,name:s,disabled:c,value:d,placeholder:p,rows:"textarea"===r?f:null})),a),b&&n.a.createElement(Ne,{status:o},b))};ye.defaultProps={children:null,label:"",labelHidden:!1,type:"text",name:void 0,status:"",disabled:!1,value:void 0,formGroup:null,hasIcon:null,size:"",placeholder:"",rows:3,hint:null};var Oe=["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","split"],ke=Object(B.a)(Object(B.a)({},z.defaults),{},{split:!1}),je=function(e){var t=e.className,a=e.topOuterDivider,i=e.bottomOuterDivider,l=e.topDivider,r=e.bottomDivider,s=e.hasBgColor,o=e.invertColor,c=e.split,d=Object(m.a)(e,Oe),u=w()("cta section center-content-mobile reveal-from-bottom",a&&"has-top-divider",i&&"has-bottom-divider",s&&"has-bg-color",o&&"invert-color",t),v=w()("cta-inner section-inner",l&&"has-top-divider",r&&"has-bottom-divider",c&&"cta-split");return n.a.createElement("section",Object.assign({},d,{className:u}),n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:v},n.a.createElement("div",{className:"cta-slogan center-content"},n.a.createElement("h3",{className:"m-0"},"Think ",n.a.createElement("i",null,"Zaquariah")," when you're thinking about your next ACM ",n.a.createElement("sup",null,"President")," || ",n.a.createElement("sub",null,"Vice President"))))))};je.defaultProps=ke;var xe=je,De=function(){return n.a.createElement(n.a.Fragment,null,n.a.createElement(Y,{className:"illustration-section-01"}),n.a.createElement(re,null),n.a.createElement(me,{invertMobile:!0,topDivider:!0,imageFill:!0,className:"illustration-section-02"}),n.a.createElement(he,{topDivider:!0}),n.a.createElement(xe,{split:!0}))};g.a.initialize(Object({NODE_ENV:"production",PUBLIC_URL:"/portfolio",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_GA_CODE);var Ce=function(){var e=Object(i.useRef)(),t=Object(c.f)();return Object(i.useEffect)((function(){var a=t.pathname;document.body.classList.add("is-loaded"),e.current.init(),function(e){g.a.set({page:e}),g.a.pageview(e)}(a)}),[t]),n.a.createElement(E,{ref:e,children:function(){return n.a.createElement(c.c,null,n.a.createElement(u,{exact:!0,path:"/",component:De,layout:q}))}})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(43);var Le=Object(o.a)();r.a.render(n.a.createElement(s.a,{history:Le},n.a.createElement(Ce,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[23,1,2]]]);
//# sourceMappingURL=main.1346a927.chunk.js.map