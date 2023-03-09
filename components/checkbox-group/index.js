import Base from "../xy-base.js";
import "../checkbox/index.js";
import style from "./index.css?inline" assert { type: "css" };

export default class XyCheckBoxGroup extends Base {
	static get observedAttributes() {
		return ["disabled", "value"];
	}

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });
		this.adoptedStyle(style);
		shadowRoot.innerHTML = `
			<slot></slot>
      `;
		this.slots = shadowRoot.querySelector('slot')
	}

	get disabled() {
		return this.getAttribute("disabled") !== null;
	}

	get required() {
		return this.getAttribute("required") !== null;
	}

	get value() {
		const checkbox =  this.querySelectorAll('xy-checkbox[checked]')
		return [...checkbox].map(el => el.value) || [];
	}

	set disabled(value) {
		this.toggleAttribute("disabled", value);
		const checkboxGroup =  [...this.querySelectorAll(`xy-checkbox`)]
		checkboxGroup.forEach(el => {
			el.disabled = value
		})
	}

	set value(value) {
		const checkboxGroup =  [...this.querySelectorAll(`xy-checkbox`)]
		checkboxGroup.forEach(el => {
			el.checked = value.includes(el.value)
		})
	}

	connectedCallback() {
		this.slots.addEventListener("slotchange", () => {
			const checkboxGroup = [...this.querySelectorAll(`xy-checkbox`)]
			checkboxGroup.forEach(el => {
				el.addEventListener('change', () => {
					this.value = checkboxGroup.filter(el => el.checked).map(el => el.value)
					this.dispatchEvent(
						new InputEvent("change")
					);
				})
			});
		})
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'disabled') {
			this[name] = newValue!==null
		}
		if (name === 'value') {
			this[name] = newValue.split(',')
		}
	}
}

if (!customElements.get("xy-checkbox-group")) {
	customElements.define("xy-checkbox-group", XyCheckBoxGroup);
}
