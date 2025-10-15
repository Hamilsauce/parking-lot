export const useTemplate = (templateName, options = {}, isSVG = false) => {
  const el = isSVG ?
    document.querySelector(`[data-template="${templateName}"]`).cloneNode(true) :
    document.querySelector(`[data-template="${templateName}"]`).firstElementChild.cloneNode(true)
  
  delete el.dataset.template;
  
  if (options.dataset) Object.assign(el.dataset, options.dataset);
  
  if (options.id) el.id = options.id;
  
  if (options.fill) el.style.fill = options.fill;
  
  return el;
};