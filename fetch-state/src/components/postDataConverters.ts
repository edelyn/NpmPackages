export function convertModelToFormData(
  data: any = {},
  form: any = null,
  namespace: string = ""
) {
  let files: any = {};
  let model: any = {};
  for (let propertyName in data) {
    if (
      data.hasOwnProperty(propertyName) &&
      data[propertyName] instanceof File
    ) {
      files[propertyName] = data[propertyName];
    } else {
      model[propertyName] = data[propertyName];
    }
  }

  model = JSON.parse(JSON.stringify(model));
  let formData = form || new FormData();

  for (let propertyName in model) {
    if (
      !model.hasOwnProperty(propertyName) ||
      (model[propertyName] !== 0 &&
        model[propertyName] !== "" &&
        model[propertyName] !== false &&
        !model[propertyName])
    )
      continue;
    let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
    if (model[propertyName] instanceof Date)
      formData.append(formKey, model[propertyName].toISOString());
    else if (model[propertyName] instanceof Array) {
      model[propertyName].forEach((element: any, index: number) => {
        const tempFormKey = `${formKey}[${index}]`;
        if (typeof element === "object")
          convertModelToFormData(element, formData, tempFormKey);
        else formData.append(tempFormKey, element.toString());
      });
    } else if (
      typeof model[propertyName] === "object" &&
      !(model[propertyName] instanceof File)
    )
      convertModelToFormData(model[propertyName], formData, formKey);
    else {
      formData.append(formKey, model[propertyName].toString());
    }
  }

  for (let propertyName in files) {
    if (files.hasOwnProperty(propertyName)) {
      formData.append(propertyName, files[propertyName]);
    }
  }
  return formData;
}

export const objectToQueryString = (initialObj: any) => {
  const reducer =
    (obj: any, parentPrefix = null) =>
    (prev: any, key: any) => {
      const val = obj[key];
      key = encodeURIComponent(key);
      const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;

      if (val == null || typeof val === "function") {
        prev.push(`${prefix}=`);
        return prev;
      }

      if (["number", "boolean", "string"].includes(typeof val)) {
        prev.push(`${prefix}=${encodeURIComponent(val)}`);
        return prev;
      }

      prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join("&"));
      return prev;
    };

  return Object.keys(initialObj).reduce(reducer(initialObj), []).join("&");
};
