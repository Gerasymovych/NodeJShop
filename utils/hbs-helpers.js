module.exports = {
    ifEquals(comparant1, comparant2, options) {
        if (comparant1 == comparant2) {
            return options.fn(this);
        }
            return options.inverse(this);

    }
}