import{_ as l,c as i,o,ag as e,j as t}from"./chunks/framework.CNC7poJT.js";const m=JSON.parse('{"title":"联系我们","description":"","frontmatter":{},"headers":[],"relativePath":"contact.md","filePath":"contact.md","lastUpdated":null}'),n={name:"contact.md"};function s(c,a,r,d,p,u){return o(),i("div",null,[...a[0]||(a[0]=[e("",8),t("div",{class:"contact-form-container"},[t("form",{class:"contact-form",action:"#",method:"post"},[t("div",{class:"form-group"},[t("label",{for:"contact-type"},"联系类型"),t("select",{id:"contact-type",name:"type",required:""},[t("option",{value:""},"请选择..."),t("option",{value:"technical"},"技术支持"),t("option",{value:"feature"},"功能建议"),t("option",{value:"business"},"商业合作"),t("option",{value:"other"},"其他")])]),t("pre",null,[t("code",null,`<div class="form-row">
  <div class="form-group">
    <label for="name">姓名</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div class="form-group">
    <label for="email">邮箱</label>
    <input type="email" id="email" name="email" required>
  </div>
</div>

<div class="form-group">
  <label for="company">公司/组织（可选）</label>
  <input type="text" id="company" name="company">
</div>

<div class="form-group">
  <label for="subject">主题</label>
  <input type="text" id="subject" name="subject" required>
</div>

<div class="form-group">
  <label for="message">详细描述</label>
  <textarea id="message" name="message" rows="6" required placeholder="请详细描述您的问题或需求..."></textarea>
</div>

<div class="form-group">
  <label for="version">SCP Upload CLI 版本（如适用）</label>
  <input type="text" id="version" name="version" placeholder="例如：1.2.3">
</div>

<div class="form-group">
  <label for="os">操作系统（如适用）</label>
  <select id="os" name="os">
    <option value="">请选择...</option>
    <option value="windows">Windows</option>
    <option value="macos">macOS</option>
    <option value="linux">Linux</option>
    <option value="other">其他</option>
  </select>
</div>

<button type="submit" class="submit-button">发送消息</button>
`)])])],-1),e("",18)])])}const b=l(n,[["render",s]]);export{m as __pageData,b as default};
