const bindAll = (classInstance: any) => {
  const p = classInstance.constructor.prototype;
  const methodNames = Object.getOwnPropertyNames(p).filter(
    (name) => typeof p[name] === "function" && name !== "constructor", // Skip constructor
  );

  methodNames.forEach((methodName) => (p[methodName] = p[methodName].bind(classInstance)));
};

export { bindAll };
