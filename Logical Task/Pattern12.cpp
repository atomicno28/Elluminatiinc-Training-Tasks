// OUTPUT

//  N  =  4

//               *
//           *  *  *
//       *  *  *  *  *
//   *  *  *  *  *  *   *
//       *  *  *  *  *
//           *  *  *  
//               *



#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    
    for(int i=1;i<2*n;i++)
    {
        if(i<=n)
        {
            for(int j=0;j<n;j++)
            {
                if(j<n-i) cout<<"  ";
                else cout<<"* ";
            }
            for(int j=1;j<i;j++)
            {
                cout<<"* ";
            }
        }
        else
        {
            for(int j=0;j<n;j++)
            {
                if(j<(i%n)) cout <<"  ";
                else cout <<"* ";
            }
            
            for(int j=1;j<(n-(i%n));j++)
            {
                cout<<"* ";
            }
        }
        cout << endl;
    }
}