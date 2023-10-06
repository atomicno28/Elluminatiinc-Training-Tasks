// OUTPUT 

// *
// *  *
// *  *  *
// *  *  *  *
// *  *  *
// *  * 
// *




#include<iostream>
using namespace std;
int main()
{
    
    int t; cin>>t;
    
    for(int i=1;i<=t;i++)
    {
        for(int j=1;j<=i;j++)
        {
            cout<<"* ";
        }
        cout << endl;
    }
    
    for(int i=1;i<t;i++)
    {
        for(int j=1;j<t-i+1;j++)
        {
            cout <<"* ";
        }
        cout << endl;
    }
}