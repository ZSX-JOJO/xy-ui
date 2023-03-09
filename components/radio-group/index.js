import Base from "../xy-base.js";
import "../radio/index.js";
import style from "./index.css?inline" assert { type: "css" };

export default class XyRadioGroup extends Base {
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

  focus() {
		this.radio.focus();
	}

	get disabled() {
		return this.getAttribute("disabled") !== null;
	}

	get required() {
		return this.getAttribute("required") !== null;
	}

	get value() {
		const radio =  this.querySelector('xy-radio[checked]')
		return radio?.value || '';
	}

	set disabled(value) {
		this.toggleAttribute("disabled", value);
		const radioGroup =  [...this.querySelectorAll(`xy-radio`)]
		radioGroup.forEach(el => {
			el.disabled = value
		})
	}

	set value(value) {
		const radioGroup =  [...this.querySelectorAll(`xy-radio`)]
		const radio = radioGroup.find(el => el.value === value);
		if (radio) {
			radio.checked = true
		}
	}

	connectedCallback() {
		this.slots.addEventListener("slotchange", () => {
			const radioGroup = [...this.querySelectorAll(`xy-radio`)]
			radioGroup.forEach(el => {
				el.radioGroup = radioGroup
				el.addEventListener('change', () => {
					this.value = el.value
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
		} else {
			this[name] = newValue
		}
	}
}

if (!customElements.get("xy-radio-group")) {
	customElements.define("xy-radio-group", XyRadioGroup);
}
