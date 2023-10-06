//OUTPUT

// N = 4

// * * * * * * * 
//  * * * * * *
//   * * * * *
//    * * * *
//     * * *
//      * *
//       *



#include<iostream>
using namespace std;
int main()
{
    
    int t; cin>>t;
    int n = t*2-1;
    
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=n;j++)
        {
            if(j<i) cout << " ";
            else cout <<"* ";
        }
        cout << endl;
    }
}