const expandData= (data, start, end, diff) => {
    const expandedArray = [];
    for (let d = new Date(start); d <= end; d.setMinutes(d.getMinutes() + 1)) {
      const existingItem = data.find(item => item.time.getTime() === d.getTime());
      if (existingItem) {
        existingItem.close += diff
        expandedArray.push(existingItem);
      } else {
        expandedArray.push({ time: new Date(d), close: null });
      }
    }
    
    return expandedArray;
  }

export default expandData;