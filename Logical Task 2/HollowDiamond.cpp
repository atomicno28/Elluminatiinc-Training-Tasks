// OUTPUT

//  


#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    
    for(int i=0;i<n;i++)
    {
        for(int j=0;j<=n;j++)
        {
           if(j==n-i) cout <<"* ";
           else cout <<"  ";
        }
        for(int j=0;j<=n;j++)
        {
            if(i==0) continue;
            if(j+1==i) cout <<"* ";
            else cout <<"  ";
        }
        cout << endl;
    }
    for(int i=0;i<=n;i++)
    {
        for(int j=0;j<=2*n;j++)
        {
            if(j==i || j==2*n-i) cout <<"* ";
            else cout <<"  ";
        }
        cout <<endl;
    }
}