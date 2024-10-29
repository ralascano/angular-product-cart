import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Product } from '../../models/product';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {

  @Input() products!: Product[];

  @Output() productEventEmitter: EventEmitter<Product> = new EventEmitter(); 

  onAddCart(event: Product) {
    this.productEventEmitter.emit(event)
  }
}
