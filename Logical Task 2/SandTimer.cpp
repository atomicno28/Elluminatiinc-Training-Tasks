#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;

    for(int i=1;i<=n;i++)
    {
            for(int j=1;j<=n;j++)
            {
                if(j<i) cout <<" ";
                else cout<<j<<" ";
            }
            cout << endl;
    }
    
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=n;j++)
        {
            if(i==1) continue;
            if(j<n+1-i) cout <<" ";
            else cout << j <<" ";
        }
        if(i!=1) cout << endl;
    }
}