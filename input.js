var input = {
	keys: {}
}

input.isKeyDown = function(key) {
	if (typeof this.keys[key] === 'undefined') {
		return false;
	}

	return this.keys[key];
}

input.onKeyDown = function(e) {
	input.keys[e.key] = true
}

input.onKeyUp = function(e) {
	input.keys[e.key] = false
}

window.addEventListener('keydown', input.onKeyDown)
window.addEventListener('keyup', input.onKeyUp)