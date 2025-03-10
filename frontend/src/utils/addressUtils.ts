/**
 * Shortens an address for display purposes
 * @param address The full address to shorten
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns The shortened address
 */
export const shortenAddress = (
    address: string,
    startChars: number = 6,
    endChars: number = 4
  ): string => {
    if (!address) return '';
    
    if (address.length <= startChars + endChars) {
      return address;
    }
    
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }; 