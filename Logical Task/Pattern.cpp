// OUTPUT

// 1 2 3 4
// 2 3 4
// 3 4
// 4

#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    
    for(int i=0;i<n;i++)
    {
        for(int j=i+1;j<=n;j++)
        {
            cout << j <<" ";
        }
        cout << endl;
    }
} 




