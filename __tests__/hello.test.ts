test("tutu", () => {

	// Arrange
	const hello = "Hello world !";

	// Act
	const result = hello.indexOf("Hello");

	// Assert
	expect(result).toBe(0);

});