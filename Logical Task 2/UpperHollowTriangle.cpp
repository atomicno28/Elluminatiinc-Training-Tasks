// OUTPUT

//     *
//    * *
//   *   *
//  *     *
// *********

#include <iostream>

using namespace std;

int main()
{
    int n; cin>>n;
    for(int i=0;i<n;i++)
    {
        for(int j=0;j<n;j++)
        {
            if(i==n-1) cout <<"* ";
            else if(j==n-i-1) cout<<"* ";
            else cout <<"  ";
        }
 
       for(int j=1;j<n;j++)
       {
           if(i==n-1) cout<<"* ";
           else if(j==i) cout<<"* ";
           else cout <<"  ";
           
       }
        
        cout << endl;
        
    }
}
