function divideTwoNums(num1, num2) {
  console.log("We are in the divide two numbers function");
  try {
    if (num2 === 0) {
      console.log("Error has occuerd");
      throw new Error("Cannot divide by zero. You noob go learn math");
    }
    const result = num1 / num2;
    //   console.log(`Result: ${result}`);
    console.log("Result: ", result);
  } catch (error) {
    console.error("Caught an error:", error.message);
  }
}

divideTwoNums(10, 0);
