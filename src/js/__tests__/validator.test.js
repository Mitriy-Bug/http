import Validator from '../validator';
test('regExp', () => {
    const validator = new Validator();
    const result = validator.validateUsername("rr111tt")
    expect(result).toBe(true);
});