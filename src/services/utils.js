export function isJWTValid(token) {
    if(token){
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
        
            // Check if token is expired
            if (!expiry || Date.now() >= expiry * 1000) {
              return false;
            }
        
            return true;
          } catch (err) {
            return false;
          }
    }
    else{
        return false;
    }
  }
  