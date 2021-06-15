# Marketplace

## APIs

* Add Market Listing


## Examples

### Add Market Listing
```graphql
mutation AddMarketListing {
  addMarketListing(
    course: "Integrated Science"
    listing: {
      name: "Snickers Bar"
      description: "One delicious Snickers bar."
      image: "https://i.imgur.com/UHm9oTg.jpeg"
      price: 5
      stock: 10
    }
  ) {
    id
    course
    name
    description
    price
    stock
    listedDate
    timesPurchased
  }
}
```