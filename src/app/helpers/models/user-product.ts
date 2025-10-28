export interface UserProduct {
  userProductId: string;                  
  userId: string;   
  userName: string;           
  productId: string;
  productName: string;  
  productDescription?: string;
  productPicture?: string;
  categoryName?: string;         
  state: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO'; 
  moderationComment?: string; 
}