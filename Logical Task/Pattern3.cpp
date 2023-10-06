
// OUTPUT 

// 5 4 3 2 1
// 2 3 4 5
// 5 4 3
// 4 5 
// 5

#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    
    bool rev = 1;
    for(int i=0;i<n;i++)
    {
       if(!rev)
       {
           for(int j=i+1;j<=n;j++)
           {
               cout << j << " ";
           }
       }
       else
       {
           for(int j=n ; j>i ; j--)
           {
               cout << j << " ";
           }
       }
       rev = !rev;
       cout << endl;
    }
} 
