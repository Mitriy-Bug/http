export default class Validator {
    validateUsername(userName) {
        const onlyAllowedCharacters = /^[A-Za-z0-9_-]+$/;
        const notStartWithNumbersOrSymbols = /^[^0-9_-]/;
        const notEndWithNumbersOrSymbols = /[^0-9_-]$/;
        const noMoreThanThreeDigitsInRow = /^(?:(?!\d{4}).)*$/;

        return (
            onlyAllowedCharacters.test(userName) &&
            notStartWithNumbersOrSymbols.test(userName) &&
            notEndWithNumbersOrSymbols.test(userName) &&
            noMoreThanThreeDigitsInRow.test(userName)
        );
    }
}