function addCrossSell(element) {
    console.log(element)

    const variantID = element.dataset.variantid

    CartJS.addItem(variantID, 1);
}